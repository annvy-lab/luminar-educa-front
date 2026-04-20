import { calendar_v3 } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

import { getCalendarClient } from "@/_lib/google";
import { prisma } from "@/_lib/prisma";

function extractAccessToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export async function GET(request: NextRequest) {
  const accessToken = extractAccessToken(request);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Authorization header com Bearer token é obrigatório." },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const calendarId = searchParams.get("calendarId") ?? "primary";
    const timeMin = searchParams.get("timeMin") ?? new Date().toISOString();
    const timeMax = searchParams.get("timeMax") ?? undefined;
    const maxResults = Number(searchParams.get("maxResults") ?? 50);
    const q = searchParams.get("q") ?? undefined;

    const calendar = getCalendarClient(accessToken);

    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      maxResults,
      q,
      singleEvents: true,
      orderBy: "startTime",
    });

    return NextResponse.json(
      { events: response.data.items ?? [] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const accessToken = extractAccessToken(request);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Authorization header com Bearer token é obrigatório." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const {
      calendarId = "primary",
      summary,
      description,
      location,
      start,
      end,
      attendees,
      sendUpdates = "none",
      createMeet = false,
      bookingId,
    } = body as {
      calendarId?: string;
      summary: string;
      description?: string;
      location?: string;
      start: string;
      end: string;
      attendees?: string[];
      sendUpdates?: "all" | "externalOnly" | "none";
      createMeet?: boolean;
      bookingId?: string;
    };

    if (!summary || !start || !end) {
      return NextResponse.json(
        { error: "Os campos 'summary', 'start' e 'end' são obrigatórios." },
        { status: 400 },
      );
    }

    const eventBody: calendar_v3.Schema$Event = {
      summary,
      description,
      location,
      start: { dateTime: start },
      end: { dateTime: end },
      attendees: attendees?.map((email) => ({ email })),
      ...(createMeet && {
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      }),
    };

    const calendar = getCalendarClient(accessToken);

    const response = await calendar.events.insert({
      calendarId,
      sendUpdates,
      conferenceDataVersion: createMeet ? 1 : 0,
      requestBody: eventBody,
    });

    if (bookingId) {
      const meetLink =
        response.data.conferenceData?.entryPoints?.find(
          (ep) => ep.entryPointType === "video",
        )?.uri ?? null;

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          googleEventId: response.data.id ?? null,
          meetLink,
        },
      });
    }

    return NextResponse.json({ event: response.data }, { status: 201 });
  } catch (error) {
    console.error("Erro:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const accessToken = extractAccessToken(request);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Authorization header com Bearer token é obrigatório." },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const calendarId = searchParams.get("calendarId") ?? "primary";

    if (!eventId) {
      return NextResponse.json(
        { error: "Query param 'eventId' é obrigatório." },
        { status: 400 },
      );
    }

    const calendar = getCalendarClient(accessToken);

    await calendar.events.delete({ calendarId, eventId });

    return NextResponse.json(
      { message: "Evento removido com sucesso." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const accessToken = extractAccessToken(request);
  if (!accessToken) {
    return NextResponse.json(
      { error: "Authorization header com Bearer token é obrigatório." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const {
      eventId,
      calendarId = "primary",
      summary,
      description,
      location,
      start,
      end,
      attendees,
      sendUpdates = "none",
    } = body as {
      eventId: string;
      calendarId?: string;
      summary?: string;
      description?: string;
      location?: string;
      start?: string;
      end?: string;
      attendees?: string[];
      sendUpdates?: "all" | "externalOnly" | "none";
    };

    if (!eventId) {
      return NextResponse.json(
        { error: "Campo 'eventId' é obrigatório." },
        { status: 400 },
      );
    }

    const patchBody: calendar_v3.Schema$Event = {
      ...(summary !== undefined && { summary }),
      ...(description !== undefined && { description }),
      ...(location !== undefined && { location }),
      ...(start !== undefined && { start: { dateTime: start } }),
      ...(end !== undefined && { end: { dateTime: end } }),
      ...(attendees !== undefined && {
        attendees: attendees.map((email) => ({ email })),
      }),
    };

    const calendar = getCalendarClient(accessToken);

    const response = await calendar.events.patch({
      calendarId,
      eventId,
      sendUpdates,
      requestBody: patchBody,
    });

    return NextResponse.json({ event: response.data }, { status: 200 });
  } catch (error) {
    console.error("Erro:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
