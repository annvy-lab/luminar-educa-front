import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/_lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get("subjectId");
    const search = searchParams.get("search");
    const minRating = searchParams.get("minRating");
    const maxPrice = searchParams.get("maxPrice");

    const teacherWhere: Prisma.TeacherWhereInput = {
      status: "APPROVED",
    };

    if (maxPrice) {
      teacherWhere.hourlyRateCents = { lte: Number(maxPrice) };
    }

    if (search) {
      teacherWhere.user = {
        name: {
          contains: search,
          mode: "insensitive",
        },
      };
    }

    const where: Prisma.TeacherSubjectWhereInput = {
      teacher: teacherWhere,
    };

    if (subjectId) {
      where.subjectId = subjectId;
    }

    const teacherSubjects = await prisma.teacherSubject.findMany({
      where,
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
        teacher: {
          select: {
            id: true,
            bio: true,
            hourlyRateCents: true,
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
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
            _count: {
              select: {
                reviews: {
                  where: { status: "VISIBLE" },
                },
                bookings: {
                  where: { status: "COMPLETED" },
                },
              },
            },
          },
        },
      },
      orderBy: [
        { subject: { name: "asc" } },
        { teacher: { user: { name: "asc" } } },
      ],
    });

    const results = await Promise.all(
      teacherSubjects.map(async (ts) => {
        const avgRating = await prisma.review.aggregate({
          where: {
            teacherId: ts.teacher.id,
            status: "VISIBLE",
          },
          _avg: {
            rating: true,
          },
        });

        return {
          subject: ts.subject,
          level: ts.level,
          teacher: {
            id: ts.teacher.id,
            bio: ts.teacher.bio,
            hourlyRateCents: ts.teacher.hourlyRateCents,
            user: ts.teacher.user,
            availabilities: ts.teacher.availabilities,
            stats: {
              averageRating: avgRating._avg.rating
                ? Number(avgRating._avg.rating.toFixed(1))
                : null,
              totalReviews: ts.teacher._count.reviews,
              completedBookings: ts.teacher._count.bookings,
            },
          },
        };
      }),
    );

    let filteredResults = results;
    if (minRating) {
      filteredResults = results.filter(
        (r) =>
          r.teacher.stats.averageRating !== null &&
          r.teacher.stats.averageRating >= Number(minRating),
      );
    }

    return NextResponse.json(
      {
        subjectTeachers: filteredResults,
        total: filteredResults.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao listar matérias com professores:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
