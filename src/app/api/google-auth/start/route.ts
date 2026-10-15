import { NextResponse } from "next/server";
import { ESCOPO_DRIVE } from "@/lib/drive";

/**
 * Passo único de autorização da conta Google da Renata.
 * Acesse /api/google-auth/start?chave=CRON_SECRET para começar.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (!process.env.CRON_SECRET || url.searchParams.get("chave") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: "GOOGLE_CLIENT_ID não configurado" }, { status: 500 });
  }

  const estado = crypto.randomUUID();
  const redirectUri = `${url.origin}/api/google-auth/callback`;
  const google = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  google.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID);
  google.searchParams.set("redirect_uri", redirectUri);
  google.searchParams.set("response_type", "code");
  google.searchParams.set("scope", ESCOPO_DRIVE);
  google.searchParams.set("access_type", "offline");
  google.searchParams.set("prompt", "consent");
  google.searchParams.set("state", estado);

  const resposta = NextResponse.redirect(google);
  resposta.cookies.set("amrs_google_estado", estado, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/api/google-auth",
  });
  return resposta;
}
