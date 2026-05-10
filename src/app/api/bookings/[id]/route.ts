import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/_lib/auth";
import { prisma } from "@/_lib/prisma";

/**
 * GET /api/bookings/[id]
 * Busca detalhes de um agendamento específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id },
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
            createdAt: true,
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
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Agendamento não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/bookings/[id]
 * Atualiza status do agendamento
 * Ações: confirm (professor), reject (professor), cancel (aluno/professor), complete (sistema)
 * Rota protegida - requer autenticação
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // Verificar autenticação
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body as {
      action: "confirm" | "reject" | "cancel" | "complete";
    };

    if (!action) {
      return NextResponse.json(
        { error: "Campo obrigatório: action" },
        { status: 400 },
      );
    }

    // Buscar agendamento
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            userId: true,
          },
        },
        teacher: {
          select: {
            userId: true,
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Agendamento não encontrado." },
        { status: 404 },
      );
    }

    // Validar permissões
    if (action === "confirm" || action === "reject") {
      // Apenas professor pode confirmar/rejeitar
      if (user.role !== "TEACHER" || booking.teacher.userId !== user.id) {
        return NextResponse.json(
          { error: "Apenas o professor pode confirmar ou rejeitar." },
          { status: 403 },
        );
      }

      if (booking.status !== "SCHEDULED") {
        return NextResponse.json(
          { error: "Apenas agendamentos pendentes podem ser confirmados." },
          { status: 400 },
        );
      }
    }

    if (action === "cancel") {
      // Aluno ou professor podem cancelar
      const isStudent =
        user.role === "STUDENT" && booking.student.userId === user.id;
      const isTeacher =
        user.role === "TEACHER" && booking.teacher.userId === user.id;

      if (!isStudent && !isTeacher) {
        return NextResponse.json(
          { error: "Você não tem permissão para cancelar este agendamento." },
          { status: 403 },
        );
      }

      if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
        return NextResponse.json(
          { error: "Este agendamento não pode ser cancelado." },
          { status: 400 },
        );
      }
    }

    // Executar ação
    let updatedBooking;

    switch (action) {
      case "confirm":
        // Professor confirma - agendamento continua SCHEDULED até pagamento
        updatedBooking = await prisma.booking.update({
          where: { id },
          data: {
            status: "SCHEDULED",
            updatedAt: new Date(),
          },
        });
        break;

      case "reject":
        // Professor rejeita
        updatedBooking = await prisma.booking.update({
          where: { id },
          data: {
            status: "CANCELLED",
            updatedAt: new Date(),
          },
        });
        break;

      case "cancel":
        // Cancelamento
        updatedBooking = await prisma.booking.update({
          where: { id },
          data: {
            status: "CANCELLED",
            updatedAt: new Date(),
          },
        });

        // TODO: Se já foi pago, processar reembolso
        if (booking.payment && booking.payment.status === "SUCCEEDED") {
          // Implementar lógica de reembolso aqui
        }
        break;

      case "complete":
        // Marcar como completo (após a aula)
        updatedBooking = await prisma.booking.update({
          where: { id },
          data: {
            status: "COMPLETED",
            updatedAt: new Date(),
          },
        });
        break;

      default:
        return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
    }

    return NextResponse.json(
      {
        booking: updatedBooking,
        message: `Agendamento ${action === "confirm" ? "confirmado" : action === "reject" ? "rejeitado" : action === "cancel" ? "cancelado" : "completado"} com sucesso.`,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
