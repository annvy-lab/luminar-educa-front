import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/_lib/prisma";

/**
 * GET /api/teachers/[id]
 * Busca detalhes completos de um professor específico
 * Rota pública - não requer autenticação
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: {
        id: true,
        bio: true,
        hourlyRateCents: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
                subject: {
                  select: {
                    name: true,
                  },
                },
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
    });

    if (!teacher) {
      return NextResponse.json(
        { error: "Professor não encontrado." },
        { status: 404 },
      );
    }

    // Apenas retornar professores aprovados
    if (teacher.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Professor não está disponível." },
        { status: 404 },
      );
    }

    // Calcular estatísticas
    const avgRating = await prisma.review.aggregate({
      where: {
        teacherId: id,
        status: "VISIBLE",
      },
      _avg: {
        rating: true,
      },
    });

    // Distribuição de ratings
    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where: {
        teacherId: id,
        status: "VISIBLE",
      },
      _count: {
        rating: true,
      },
    });

    const stats = {
      averageRating: avgRating._avg.rating
        ? Number(avgRating._avg.rating.toFixed(1))
        : null,
      totalReviews: teacher._count.reviews,
      completedBookings: teacher._count.bookings,
      ratingDistribution: ratingDistribution.reduce(
        (acc, curr) => {
          acc[curr.rating] = curr._count.rating;
          return acc;
        },
        {} as Record<number, number>,
      ),
    };

    return NextResponse.json(
      {
        teacher: {
          ...teacher,
          stats,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao buscar professor:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
