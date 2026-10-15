import { NextResponse } from "next/server";

/**
 * Recebe o retorno do Google e mostra o código que a Renata deve colar na
 * Vercel (GOOGLE_REFRESH_TOKEN). Nada é guardado no servidor.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const estado = url.searchParams.get("state");
  const cookie = request.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("amrs_google_estado="))
    ?.split("=")[1];

  if (!code || !estado || estado !== cookie) {
    return NextResponse.json({ error: "autorização inválida, comece de novo" }, { status: 400 });
  }

  const resposta = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: `${url.origin}/api/google-auth/callback`,
      grant_type: "authorization_code",
    }),
  });
  const dados = await resposta.json();

  if (!resposta.ok || !dados.refresh_token) {
    return NextResponse.json(
      { error: "o Google não devolveu o código", detalhe: dados.error ?? resposta.status },
      { status: 400 }
    );
  }

  const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Autorização concluída</title>
<body style="font-family:system-ui;max-width:640px;margin:40px auto;padding:0 20px">
<h1>Autorização concluída</h1>
<p>Copie o código abaixo e cole na Vercel, na variável <b>GOOGLE_REFRESH_TOKEN</b>. Depois feche esta página.</p>
<textarea readonly onclick="this.select()" style="width:100%;height:120px;font-size:14px">${dados.refresh_token}</textarea>
<p style="color:#b00">Não compartilhe este código com ninguém.</p>
</body></html>`;

  const saida = new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
  saida.cookies.delete("amrs_google_estado");
  return saida;
}
