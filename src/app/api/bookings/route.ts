import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/_lib/auth";
import { prisma } from "@/_lib/prisma";

/**
 * POST /api/bookings
 * Cria um novo agendamento (status SCHEDULED - pendente de confirmação do professor)
 * Rota protegida - requer autenticação como STUDENT
 */
export async function POST(request: NextRequest) {
  // Verificar autenticação
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  // Verificar se é estudante
  if (user.role !== "STUDENT") {
    return NextResponse.json(
      { error: "Apenas estudantes podem criar agendamentos." },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const {
      teacherId,
      subjectId,
      scheduledAt,
      durationMinutes = 60,
      studentNotes,
    } = body as {
      teacherId: string;
      subjectId: string;
      scheduledAt: string; // ISO 8601
      durationMinutes?: number;
      studentNotes?: string;
    };

    // Usar o studentId do usuário autenticado
    const studentId = user.studentProfile?.id;

    if (!studentId) {
      return NextResponse.json(
        { error: "Perfil de estudante não encontrado." },
        { status: 404 },
      );
    }

    // Validações básicas
    if (!teacherId || !subjectId || !scheduledAt) {
      return NextResponse.json(
        {
          error: "Campos obrigatórios: teacherId, subjectId, scheduledAt",
        },
        { status: 400 },
      );
    }

    // Verificar se o professor existe e está aprovado
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
        status: true,
        hourlyRateCents: true,
        subjects: {
          where: {
            subjectId,
          },
        },
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
        { error: "Professor não está aprovado para dar aulas." },
        { status: 400 },
      );
    }

    // Verificar se o professor ensina essa matéria
    if (teacher.subjects.length === 0) {
      return NextResponse.json(
        { error: "Professor não ensina essa matéria." },
        { status: 400 },
      );
    }

    // Verificar se o professor tem preço configurado
    if (!teacher.hourlyRateCents) {
      return NextResponse.json(
        { error: "Professor não tem valor por hora configurado." },
        { status: 400 },
      );
    }

    // Verificar se a matéria existe
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
    });

    if (!subject) {
      return NextResponse.json(
        { error: "Matéria não encontrada." },
        { status: 404 },
      );
    }

    // Verificar se já existe um agendamento no mesmo horário para o professor
    const scheduledDate = new Date(scheduledAt);
    const endDate = new Date(
      scheduledDate.getTime() + durationMinutes * 60 * 1000,
    );

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        teacherId,
        status: {
          in: ["SCHEDULED", "ONGOING"],
        },
        OR: [
          {
            // Novo agendamento começa durante um existente
            AND: [
              { scheduledAt: { lte: scheduledDate } },
              {
                scheduledAt: {
                  gte: new Date(
                    scheduledDate.getTime() - 60 * 60 * 1000, // 1 hora antes
                  ),
                },
              },
            ],
          },
        ],
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        {
          error:
            "Professor já possui um agendamento neste horário ou próximo a ele.",
        },
        { status: 409 },
      );
    }

    // Calcular valor total baseado na duração
    const totalAmountCents = Math.round(
      (teacher.hourlyRateCents * durationMinutes) / 60,
    );

    // Criar o agendamento
    const booking = await prisma.booking.create({
      data: {
        studentId,
        teacherId,
        subjectId,
        scheduledAt: scheduledDate,
        durationMinutes,
        totalAmountCents,
        studentNotes,
        status: "SCHEDULED", // Pendente de confirmação do professor
      },
      select: {
        id: true,
        scheduledAt: true,
        durationMinutes: true,
        totalAmountCents: true,
        status: true,
        studentNotes: true,
        createdAt: true,
        student: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            hourlyRateCents: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        booking,
        message:
          "Agendamento criado com sucesso! Aguardando confirmação do professor.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/bookings
 * Lista agendamentos do usuário autenticado (estudante ou professor)
 * Query params: status (opcional)
 * Rota protegida - requer autenticação
 */
export async function GET(request: NextRequest) {
  // Verificar autenticação
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    // Construir filtro baseado no role do usuário autenticado
    const where: any = {};

    if (user.role === "STUDENT") {
      const studentId = user.studentProfile?.id;

      if (!studentId) {
        return NextResponse.json(
          { error: "Perfil de estudante não encontrado." },
          { status: 404 },
        );
      }

      where.studentId = studentId;
    } else if (user.role === "TEACHER") {
      const teacher = await prisma.teacher.findFirst({
        where: { userId: user.id },
      });

      if (!teacher) {
        return NextResponse.json(
          { error: "Perfil de professor não encontrado." },
          { status: 404 },
        );
      }

      where.teacherId = teacher.id;
    } else {
      return NextResponse.json(
        { error: "Role inválido para listar agendamentos." },
        { status: 403 },
      );
    }

    // Filtro por status
    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      select: {
        id: true,
        scheduledAt: true,
        durationMinutes: true,
        totalAmountCents: true,
        status: true,
        meetLink: true,
        googleEventId: true,
        studentNotes: true,
        createdAt: true,
        updatedAt: true,
        student: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        teacher: {
          select: {
            id: true,
            hourlyRateCents: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            description: true,
            iconSlug: true,
          },
        },
        payment: {
          select: {
            id: true,
            status: true,
            method: true,
            amountCents: true,
            paidAt: true,
          },
        },
        review: {
          select: {
            id: true,
            rating: true,
            comment: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });

    return NextResponse.json(
      {
        bookings,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao listar agendamentos:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
