import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/_lib/prisma";

/**
 * GET /api/teachers/[id]/availability
 * Retorna horários disponíveis de um professor para uma data específica
 * Query params: date (YYYY-MM-DD)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { error: "Query param obrigatório: date (formato YYYY-MM-DD)" },
        { status: 400 },
      );
    }

    // Verificar se professor existe e está aprovado
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
      },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Professor não encontrado." },
        { status: 404 },
      );
    }

    if (teacher.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Professor não está disponível." },
        { status: 400 },
      );
    }

    const targetDate = new Date(dateParam);
    const dayOfWeek = targetDate.getDay(); // 0 = Domingo, 6 = Sábado

    // Buscar disponibilidades do professor para esse dia
    const availabilities = await prisma.availability.findMany({
      where: {
        teacherId: id,
        OR: [
          // Disponibilidade recorrente para esse dia da semana
          {
            isRecurring: true,
            dayOfWeek,
          },
          // Disponibilidade específica para essa data
          {
            isRecurring: false,
            specificDate: {
              gte: new Date(targetDate.setHours(0, 0, 0, 0)),
              lt: new Date(targetDate.setHours(23, 59, 59, 999)),
            },
          },
        ],
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        isRecurring: true,
        specificDate: true,
      },
    });

    if (availabilities.length === 0) {
      return NextResponse.json(
        {
          availableSlots: [],
          message: "Professor não tem disponibilidade para esta data.",
        },
        { status: 200 },
      );
    }

    // Buscar agendamentos já existentes para essa data
    const startOfDay = new Date(dateParam);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateParam);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await prisma.booking.findMany({
      where: {
        teacherId: id,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["SCHEDULED", "ONGOING"],
        },
      },
      select: {
        scheduledAt: true,
        durationMinutes: true,
      },
    });

    // Gerar slots de 60 minutos para cada disponibilidade
    const availableSlots: Array<{
      startTime: string;
      endTime: string;
      available: boolean;
    }> = [];

    for (const availability of availabilities) {
      const [startHour, startMinute] = availability.startTime
        .split(":")
        .map(Number);
      const [endHour, endMinute] = availability.endTime.split(":").map(Number);

      const slotStart = new Date(dateParam);
      slotStart.setHours(startHour, startMinute, 0, 0);

      const slotEnd = new Date(dateParam);
      slotEnd.setHours(endHour, endMinute, 0, 0);

      // Gerar slots de 60 minutos
      let currentSlot = new Date(slotStart);

      while (currentSlot < slotEnd) {
        const nextSlot = new Date(currentSlot.getTime() + 60 * 60 * 1000);

        // Verificar se esse slot está ocupado
        const isOccupied = existingBookings.some((booking) => {
          const bookingEnd = new Date(
            booking.scheduledAt.getTime() + booking.durationMinutes * 60 * 1000,
          );

          // Verifica se há sobreposição
          return (
            (currentSlot >= booking.scheduledAt && currentSlot < bookingEnd) ||
            (nextSlot > booking.scheduledAt && nextSlot <= bookingEnd) ||
            (currentSlot <= booking.scheduledAt && nextSlot >= bookingEnd)
          );
        });

        availableSlots.push({
          startTime: currentSlot.toISOString(),
          endTime: nextSlot.toISOString(),
          available: !isOccupied,
        });

        currentSlot = nextSlot;
      }
    }

    // Ordenar por horário
    availableSlots.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );

    // Filtrar apenas os disponíveis
    const onlyAvailable = availableSlots.filter((slot) => slot.available);

    return NextResponse.json(
      {
        date: dateParam,
        teacherId: id,
        availableSlots: onlyAvailable,
        allSlots: availableSlots, // Incluir todos para debug
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao buscar disponibilidade:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
