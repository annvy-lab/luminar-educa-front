import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/_lib/prisma";

const TOKEN_EXPIRY: Record<string, number> = {
  try {
    const { searchParams } = new URL(request.url);

    // Filtros opcionais
    const subjectId = searchParams.get("subjectId");
    const search = searchParams.get("search"); // busca por nome
    const minRating = searchParams.get("minRating");
    const maxPrice = searchParams.get("maxPrice"); // em centavos

    // Paginação
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 20);
    const skip = (page - 1) * limit;

    // Construir filtros dinâmicos
    const where: Prisma.TeacherWhereInput = {
      status: "APPROVED", // Apenas professores aprovados
    };

    // Filtro por matéria
    if (subjectId) {
      where.subjects = {
        some: {
          subjectId,
        },
      };
    }

    // Filtro por preço máximo
    if (maxPrice) {
      where.hourlyRateCents = {
        lte: Number(maxPrice),
      };
    }

    // Filtro por nome do professor
    if (search) {
      where.user = {
        name: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    // Buscar professores
    const teachers = await prisma.teacher.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        bio: true,
        hourlyRateCents: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        subjects: {
          select: {
            level: true,
            subject: {
              select: {
                id: true,
                name: true,
                description: true,
                iconSlug: true,
              },
            },
          },
        },
        availabilities: {
          select: {
            id: true,
            dayOfWeek: true,
            specificDate: true,
            startTime: true,
            endTime: true,
            isRecurring: true,
          },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
        reviews: {
          where: {
            status: "VISIBLE",
          },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            booking: {
              select: {
                student: {
                  select: {
                    user: {
                      select: {
                        name: true,
                        avatarUrl: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Últimas 5 avaliações
        },
        _count: {
          select: {
            reviews: {
              where: {
                status: "VISIBLE",
              },
            },
            bookings: {
              where: {
                status: "COMPLETED",
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calcular rating médio para cada professor
    const teachersWithStats = await Promise.all(
      teachers.map(async (teacher) => {
        const avgRating = await prisma.review.aggregate({
          where: {
            teacherId: teacher.id,
            status: "VISIBLE",
          },
          _avg: {
            rating: true,
          },
        });

        return {
          ...teacher,
          stats: {
            averageRating: avgRating._avg.rating
              ? Number(avgRating._avg.rating.toFixed(1))
              : null,
            totalReviews: teacher._count.reviews,
            completedBookings: teacher._count.bookings,
          },
        };
      }),
    );

    // Filtrar por rating mínimo (após calcular)
    let filteredTeachers = teachersWithStats;
    if (minRating) {
      filteredTeachers = teachersWithStats.filter(
        (t) =>
          t.stats.averageRating !== null &&
          t.stats.averageRating >= Number(minRating),
      );
    }

    // Contar total para paginação
    const total = await prisma.teacher.count({ where });

    return NextResponse.json(
      {
        teachers: filteredTeachers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao listar professores:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
