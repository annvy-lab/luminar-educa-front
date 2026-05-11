import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/_lib/prisma";

/**
 * GET /api/auth/check
 * Retorna os dados do usuário autenticado baseado no cookie JWT
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("luminar_auth")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
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

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 },
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return NextResponse.json(
      { error: "Token inválido ou expirado." },
      { status: 401 },
    );
  }
}
