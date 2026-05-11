import { NextRequest, NextResponse } from "next/server";

import { requireAuth } from "@/_lib/auth";

/**
 * GET /api/profile
 * Retorna o perfil do usuário autenticado
 * Rota protegida - requer autenticação
 */
export async function GET(request: NextRequest) {
  // Verificar autenticação
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = authResult;

  return NextResponse.json(
    {
      profile: user,
    },
    { status: 200 },
  );
}
