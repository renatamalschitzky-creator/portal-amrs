/**
 * Envio de arquivos dos clientes para o Google Drive da Renata.
 *
 * O portal usa uma autorização única da conta dela (refresh token) para criar
 * uma "sessão de envio" na pasta do cliente. O navegador do cliente manda o
 * arquivo direto para o Google, sem passar pela Vercel (que limita o tamanho).
 */

export const ESCOPO_DRIVE = "https://www.googleapis.com/auth/drive";

export function driveConfigurado(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
  );
}

/** Extrai o ID da pasta de um link do Drive (.../folders/ID?usp=sharing). */
export function pastaIdDoLink(link: string | undefined): string | undefined {
  if (!link) return undefined;
  const match = link.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  return match?.[1];
}

export async function obterAccessToken(): Promise<string> {
  const resposta = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });
  const dados = await resposta.json();
  if (!resposta.ok || !dados.access_token) {
    throw new Error(`Google recusou a autorização: ${dados.error ?? resposta.status}`);
  }
  return dados.access_token as string;
}

/**
 * Cria a sessão de envio resumível e devolve o endereço para onde o navegador
 * deve mandar o arquivo. O cabeçalho Origin libera o envio direto do navegador.
 */
export async function criarSessaoDeUpload(opts: {
  pastaId: string;
  nome: string;
  tipo: string;
  tamanho: number;
  origem: string;
}): Promise<string> {
  const accessToken = await obterAccessToken();
  const resposta = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id,name",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": opts.tipo || "application/octet-stream",
        "X-Upload-Content-Length": String(opts.tamanho),
        Origin: opts.origem,
      },
      body: JSON.stringify({ name: opts.nome, parents: [opts.pastaId] }),
    }
  );
  const sessao = resposta.headers.get("location");
  if (!resposta.ok || !sessao) {
    throw new Error(`Não foi possível iniciar o envio (${resposta.status})`);
  }
  return sessao;
}
