import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { verifyGoogleIdToken } from "@/_lib/google";
import { prisma } from "@/_lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, role } = body as {
      idToken?: string;
      role?: "STUDENT" | "TEACHER";
    };

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "Campo 'idToken' é obrigatório." },
        { status: 400 },
      );
    }

    const payload = await verifyGoogleIdToken(idToken);

    if (!payload.email || !payload.name) {
      return NextResponse.json(
        { error: "Token não contém e-mail ou nome." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        teacherProfile: { select: { id: true, status: true } },
      },
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser }, { status: 200 });
    }

    if (!role) {
      return NextResponse.json(
        {
          needsOnboarding: true,
          profile: {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
          },
        },
        { status: 200 },
      );
    }

    if (role !== "STUDENT" && role !== "TEACHER") {
      return NextResponse.json(
        { error: "Role inválido. Use 'STUDENT' ou 'TEACHER'." },
        { status: 400 },
      );
    }

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: payload.email!,
          name: payload.name!,
          avatarUrl: payload.picture ?? null,
          role: role as UserRole,
        },
      });

      if (role === "STUDENT") {
        await tx.student.create({ data: { userId: created.id } });
      }

      if (role === "TEACHER") {
        await tx.teacher.create({
          data: { userId: created.id },
        });
      }

      return tx.user.findUnique({
        where: { id: created.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          teacherProfile: { select: { id: true, status: true } },
        },
      });
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
