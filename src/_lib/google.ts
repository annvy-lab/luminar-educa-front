import { OAuth2Client } from "google-auth-library"
import { google } from "googleapis"

/**
 * Retorna um cliente OAuth2 configurado com as credenciais da aplicação.
 * As credenciais são lidas das variáveis de ambiente e nunca expostas ao client.
 */
export function getOAuth2Client(accessToken?: string): OAuth2Client {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  if (accessToken) {
    client.setCredentials({ access_token: accessToken })
  }

  return client
}

/**
 * Verifica um ID Token emitido pelo Google e retorna o payload decodificado.
 * Use isso para validar tokens vindos do botão "Sign in with Google" no front-end.
 *
 * @param idToken  - O `credential` retornado pelo Google Identity Services (GIS)
 * @throws         - Erro se o token for inválido ou expirado
 */
export async function verifyGoogleIdToken(idToken: string) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()
  if (!payload) throw new Error("Token payload vazio")

  return payload
}

/**
 * Retorna uma instância da API do Google Calendar autenticada com o
 * access token do usuário.
 *
 * @param accessToken - Token de acesso OAuth2 (scope: calendar)
 */
export function getCalendarClient(accessToken: string) {
  const auth = getOAuth2Client(accessToken)
  return google.calendar({ version: "v3", auth })
}
