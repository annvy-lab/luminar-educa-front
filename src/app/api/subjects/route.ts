import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/_lib/prisma";

/**
 * GET /api/subjects
 * Lista todas as matérias disponíveis
 * Rota pública - não requer autenticação
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: any = {};

    // Filtro por nome da matéria
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const subjects = await prisma.subject.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        iconSlug: true,
        _count: {
          select: {
            teachers: {
              where: {
                teacher: {
                  status: "APPROVED",
                },
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Formatar resposta com contagem de professores
    const subjectsWithCount = subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      description: subject.description,
      iconSlug: subject.iconSlug,
      teacherCount: subject._count.teachers,
    }));

    return NextResponse.json(
      {
        subjects: subjectsWithCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao listar matérias:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
