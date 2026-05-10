import { NextRequest, NextResponse } from "next/server";

import { requireAuthWithRole } from "@/_lib/auth";
import { prisma } from "@/_lib/prisma";

/**
 * GET /api/teacher/me
 * Retorna o perfil completo do professor autenticado (próprio perfil)
 * Rota protegida - requer role TEACHER
 */
export async function GET(request: NextRequest) {
  // Verificar autenticação e role
  const authResult = await requireAuthWithRole(request, ["TEACHER"]);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  // Buscar perfil completo do professor
  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
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
      subjects: {
        include: {
          subject: true,
        },
      },
      availabilities: {
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      },
      _count: {
        select: {
          bookings: {
            where: {
              status: "COMPLETED",
            },
          },
          reviews: {
            where: {
              status: "VISIBLE",
            },
          },
        },
      },
    },
  });

  if (!teacher) {
    return NextResponse.json(
      { error: "Perfil de professor não encontrado." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      teacher,
    },
    { status: 200 },
  );
}

/**
 * PATCH /api/teacher/me
 * Atualiza o perfil do professor autenticado
 * Rota protegida - requer role TEACHER
 */
export async function PATCH(request: NextRequest) {
  // Verificar autenticação e role
  const authResult = await requireAuthWithRole(request, ["TEACHER"]);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  try {
    const body = await request.json();
    const { bio, hourlyRateCents, diplomaFileUrl } = body as {
      bio?: string;
      hourlyRateCents?: number;
      diplomaFileUrl?: string;
    };

    // Atualizar perfil do professor
    const updatedTeacher = await prisma.teacher.update({
      where: { userId: user.id },
      data: {
        ...(bio !== undefined && { bio }),
        ...(hourlyRateCents !== undefined && { hourlyRateCents }),
        ...(diplomaFileUrl !== undefined && { diplomaFileUrl }),
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
        teacher: updatedTeacher,
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
