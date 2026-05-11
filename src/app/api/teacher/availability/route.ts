import { NextRequest, NextResponse } from "next/server";

import { requireAuthWithRole } from "@/_lib/auth";
import { prisma } from "@/_lib/prisma";

export async function GET(request: NextRequest) {
  const authResult = await requireAuthWithRole(request, ["TEACHER"]);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Perfil de professor não encontrado." },
        { status: 404 },
      );
    }

    const availabilities = await prisma.availability.findMany({
      where: {
        teacherId: teacher.id,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(
      {
        availabilities,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao listar disponibilidades:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuthWithRole(request, ["TEACHER"]);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  try {
    const body = await request.json();
    const { dayOfWeek, specificDate, startTime, endTime, isRecurring } =
      body as {
        dayOfWeek?: number;
        specificDate?: string;
        startTime: string;
        endTime: string;
        isRecurring: boolean;
      };

    if (!startTime || !endTime || isRecurring === undefined) {
      return NextResponse.json(
        {
          error:
            "Campos obrigatórios: startTime, endTime, isRecurring (true/false)",
        },
        { status: 400 },
      );
    }

    if (isRecurring && (dayOfWeek === undefined || dayOfWeek === null)) {
      return NextResponse.json(
        {
          error:
            "Para disponibilidade recorrente, dayOfWeek é obrigatório (0-6, onde 0=Domingo)",
        },
        { status: 400 },
      );
    }

    if (!isRecurring && !specificDate) {
      return NextResponse.json(
        {
          error:
            "Para disponibilidade específica, specificDate é obrigatório (formato YYYY-MM-DD)",
        },
        { status: 400 },
      );
    }

    if (dayOfWeek !== undefined && (dayOfWeek < 0 || dayOfWeek > 6)) {
      return NextResponse.json(
        { error: "dayOfWeek deve ser entre 0 (Domingo) e 6 (Sábado)" },
        { status: 400 },
      );
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Perfil de professor não encontrado." },
        { status: 404 },
      );
    }

    const availability = await prisma.availability.create({
      data: {
        teacherId: teacher.id,
        dayOfWeek: isRecurring ? dayOfWeek : null,
        specificDate:
          !isRecurring && specificDate ? new Date(specificDate) : null,
        startTime,
        endTime,
        isRecurring,
      },
    });

    return NextResponse.json(
      {
        availability,
        message: "Disponibilidade criada com sucesso.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar disponibilidade:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
