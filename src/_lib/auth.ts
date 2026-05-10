import { UserRole } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "./prisma";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: Date;
  studentProfile?: { id: string } | null;
  teacherProfile?: { id: string; status: string } | null;
};

export async function getAuthUser(
  request: NextRequest,
): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get("luminar_auth")?.value;

    if (!token) {
      return null;
    }

    // Verificar e decodificar o JWT
    const decoded = verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      role: string;
      email: string;
    };

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
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

    return user;
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return null;
  }
}

export async function requireAuth(
  request: NextRequest,
): Promise<AuthUser | NextResponse> {
  const user = await getAuthUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Não autenticado. Faça login para continuar." },
      { status: 401 },
    );
  }

  return user;
}

export function requireRole(
  user: AuthUser,
  allowedRoles: UserRole[],
): AuthUser | NextResponse {
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      {
        error: `Acesso negado. Roles permitidos: ${allowedRoles.join(", ")}`,
      },
      { status: 403 },
    );
  }

  return user;
}

export async function requireAuthWithRole(
  request: NextRequest,
  allowedRoles: UserRole[],
): Promise<AuthUser | NextResponse> {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  return requireRole(authResult, allowedRoles);
}
