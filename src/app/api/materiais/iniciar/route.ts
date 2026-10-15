import { NextResponse } from "next/server";
import { validarAcesso } from "@/lib/acesso";
import { criarSessaoDeUpload, driveConfigurado, pastaIdDoLink } from "@/lib/drive";

const TAMANHO_MAXIMO = 500 * 1024 * 1024; // 500 MB por arquivo

/**
 * Valida o acesso do cliente e devolve o endereço de envio direto ao Drive,
 * já apontando para a pasta dele.
 */
export async function POST(request: Request) {
  if (!driveConfigurado()) {
    return NextResponse.json({ error: "envio ainda não configurado" }, { status: 503 });
  }

  let corpo: { slug?: string; token?: string; nome?: string; tipo?: string; tamanho?: number };
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ error: "pedido inválido" }, { status: 400 });
  }

  const { slug, token, nome, tipo, tamanho } = corpo;
  if (!slug || !nome || typeof tamanho !== "number" || tamanho <= 0) {
    return NextResponse.json({ error: "pedido incompleto" }, { status: 400 });
  }
  if (tamanho > TAMANHO_MAXIMO) {
    return NextResponse.json({ error: "arquivo maior que 500 MB" }, { status: 413 });
  }

  const acesso = await validarAcesso(slug, token);
  if (!acesso.ok) {
    return NextResponse.json({ error: "acesso negado" }, { status: 403 });
  }

  const pastaId = pastaIdDoLink(acesso.cliente.pastaMateriais);
  if (!pastaId) {
    return NextResponse.json({ error: "pasta ainda não criada" }, { status: 409 });
  }

  try {
    const urlDeEnvio = await criarSessaoDeUpload({
      pastaId,
      nome: nome.slice(0, 200),
      tipo: tipo ?? "",
      tamanho,
      origem: new URL(request.url).origin,
    });
    return NextResponse.json({ urlDeEnvio });
  } catch (erro) {
    console.error("[materiais] falha ao iniciar envio", erro);
    return NextResponse.json({ error: "não foi possível iniciar o envio" }, { status: 502 });
  }
}
