import { NextRequest, NextResponse } from "next/server";

import { requireAuthWithRole } from "@/_lib/auth";
import { prisma } from "@/_lib/prisma";

/**
 * GET /api/student/me
 * Retorna o perfil completo do estudante autenticado (próprio perfil)
 * Rota protegida - requer role STUDENT
 */
export async function GET(request: NextRequest) {
  // Verificar autenticação e role
  const authResult = await requireAuthWithRole(request, ["STUDENT"]);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  // Buscar perfil completo do estudante
  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
        },
      },
      bookings: {
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  avatarUrl: true,
                },
              },
            },
          },
          subject: true,
          payment: true,
        },
        orderBy: {
          scheduledAt: "desc",
        },
        take: 10, // Últimos 10 agendamentos
      },
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  if (!student) {
    return NextResponse.json(
      { error: "Perfil de estudante não encontrado." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      student,
    },
    { status: 200 },
  );
}

/**
 * PATCH /api/student/me
 * Atualiza o perfil do estudante autenticado
 * Rota protegida - requer role STUDENT
 */
export async function PATCH(request: NextRequest) {
  // Verificar autenticação e role
  const authResult = await requireAuthWithRole(request, ["STUDENT"]);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  try {
    const body = await request.json();
    const { bio } = body as {
      bio?: string;
    };

    // Atualizar perfil do estudante
    const updatedStudent = await prisma.student.update({
      where: { userId: user.id },
      data: {
        ...(bio !== undefined && { bio }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        student: updatedStudent,
        message: "Perfil atualizado com sucesso.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
