import { UserRole } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { verifyGoogleIdToken } from "@/_lib/google";
import { prisma } from "@/_lib/prisma";

/**
 * Expiração de tokens por role (em segundos)
 */
const TOKEN_EXPIRY: Record<string, number> = {
  STUDENT: 7 * 24 * 60 * 60, // 7 dias
  TEACHER: 7 * 24 * 60 * 60, // 7 dias
  ADMIN: 15 * 60, // 15 minutos
};

/**
 * Gera um JWT com expiração baseada no role do usuário.
 */
function generateToken(userId: string, role: string, email: string) {
  const expiresIn = TOKEN_EXPIRY[role] ?? TOKEN_EXPIRY.STUDENT;

  const authToken = sign(
    {
      sub: userId,
      role,
      email,
      iss: "luminar-educa-api",
      aud: "luminar-educa-web",
    },
    process.env.JWT_SECRET!,
    { expiresIn },
  );

  return { authToken, expiresInMs: expiresIn * 1000 };
}

/**
 * POST /api/auth/google
 * Autentica um usuário via Google ID Token.
 * Se o usuário não existir, cria com o role especificado.
 */
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

    // Buscar usuário existente
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        studentProfile: { select: { id: true } },
        teacherProfile: { select: { id: true, status: true } },
      },
    });

    // Se usuário existe, gera token e retorna
    if (user) {
      const { authToken, expiresInMs } = generateToken(
        user.id,
        user.role,
        user.email,
      );

      const response = NextResponse.json({ user }, { status: 200 });

      response.cookies.set("luminar_auth", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + expiresInMs),
        sameSite: "lax",
        path: "/",
      });

      return response;
    }

    // Se não existe e não enviou role, solicita onboarding
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

    // Validar role
    if (role !== "STUDENT" && role !== "TEACHER") {
      return NextResponse.json(
        { error: "Role inválido. Use 'STUDENT' ou 'TEACHER'." },
        { status: 400 },
      );
    }

    // Criar novo usuário com role
    user = await prisma.$transaction(async (tx) => {
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
        await tx.teacher.create({ data: { userId: created.id } });
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
          studentProfile: { select: { id: true } },
          teacherProfile: { select: { id: true, status: true } },
        },
      });
    });

    if (!user) {
      throw new Error("Falha ao criar usuário");
    }

    // Gerar token JWT
    const { authToken, expiresInMs } = generateToken(
      user.id,
      user.role,
      user.email,
    );

    const response = NextResponse.json({ user }, { status: 201 });

    // Setar cookie httpOnly
    response.cookies.set("luminar_auth", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + expiresInMs),
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

