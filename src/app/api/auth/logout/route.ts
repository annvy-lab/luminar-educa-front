import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Realiza o logout do usuário removendo o cookie de autenticação
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: "Logout realizado com sucesso." },
    { status: 200 },
  );

  // Remover o cookie
  response.cookies.delete("luminar_auth");

  return response;
}
