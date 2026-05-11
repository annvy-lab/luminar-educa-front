import { NextRequest, NextResponse } from "next/server";

import { getCalendarClient } from "@/_lib/google";
import { prisma } from "@/_lib/prisma";

/**
 * POST /api/bookings/[id]/payment
 * Processa pagamento do agendamento e cria evento no Google Calendar
 * TODO: Integrar com Stripe para pagamento real
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { method, accessToken } = body as {
      method: "PIX" | "CREDIT_CARD";
      accessToken?: string; // Token OAuth do Google para criar evento
    };

    if (!method) {
      return NextResponse.json(
        { error: "Campo obrigatório: method (PIX ou CREDIT_CARD)" },
        { status: 400 },
      );
    }

    // Buscar agendamento
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        payment: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Agendamento não encontrado." },
        { status: 404 },
      );
    }

    // Validar status
    if (booking.status !== "SCHEDULED") {
      return NextResponse.json(
        {
          error:
            "Apenas agendamentos confirmados podem receber pagamento. Status atual: " +
            booking.status,
        },
        { status: 400 },
      );
    }

    // Verificar se já foi pago
    if (booking.payment && booking.payment.status === "SUCCEEDED") {
      return NextResponse.json(
        { error: "Este agendamento já foi pago." },
        { status: 400 },
      );
    }

    // Calcular taxas (exemplo: 15% de taxa da plataforma)
    const platformFeePercent = 0.15;
    const platformFeeCents = Math.round(
      booking.totalAmountCents * platformFeePercent,
    );
    const teacherPayoutCents = booking.totalAmountCents - platformFeeCents;

    // TODO: Integrar com Stripe aqui
    // Por enquanto, vamos simular um pagamento bem-sucedido

    // Criar ou atualizar pagamento
    const payment = await prisma.payment.upsert({
      where: {
        bookingId: id,
      },
      create: {
        bookingId: id,
        method,
        status: "SUCCEEDED", // Simulando sucesso
        amountCents: booking.totalAmountCents,
        platformFeeCents,
        teacherPayoutCents,
        paidAt: new Date(),
      },
      update: {
        method,
        status: "SUCCEEDED",
        paidAt: new Date(),
      },
    });

    // Criar evento no Google Calendar (se accessToken fornecido)
    let meetLink = null;
    let googleEventId = null;

    if (accessToken) {
      try {
        const calendar = getCalendarClient(accessToken);

        const endTime = new Date(
          booking.scheduledAt.getTime() + booking.durationMinutes * 60 * 1000,
        );

        const event = await calendar.events.insert({
          calendarId: "primary",
          conferenceDataVersion: 1,
          sendUpdates: "all",
          requestBody: {
            summary: `Aula: ${booking.subject.name}`,
            description: `Aula de ${booking.subject.name} com ${booking.teacher.user.name}\n\nObservações do aluno: ${booking.studentNotes || "Nenhuma"}`,
            start: {
              dateTime: booking.scheduledAt.toISOString(),
              timeZone: "America/Sao_Paulo",
            },
            end: {
              dateTime: endTime.toISOString(),
              timeZone: "America/Sao_Paulo",
            },
            attendees: [
              { email: booking.student.user.email },
              { email: booking.teacher.user.email },
            ],
            conferenceData: {
              createRequest: {
                requestId: `meet-${id}-${Date.now()}`,
                conferenceSolutionKey: { type: "hangoutsMeet" },
              },
            },
          },
        });

        meetLink =
          event.data.conferenceData?.entryPoints?.find(
            (ep) => ep.entryPointType === "video",
          )?.uri ?? null;

        googleEventId = event.data.id ?? null;
      } catch (calendarError) {
        console.error("Erro ao criar evento no calendário:", calendarError);
        // Não falhar o pagamento se o calendário falhar
      }
    }

    // Atualizar booking com link do Meet e status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        meetLink,
        googleEventId,
        status: "SCHEDULED", // Mantém como agendado até a hora da aula
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
        subject: true,
        payment: true,
      },
    });

    return NextResponse.json(
      {
        booking: updatedBooking,
        payment,
        message: "Pagamento processado com sucesso! Aula agendada.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
