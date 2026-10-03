import { NextResponse } from "next/server";
import { listClientes, listClientesSemLink, salvarLinkDoCliente } from "@/lib/notion";
import { montarLinkDoPortal } from "@/lib/token";

/**
 * Gera automaticamente o link de acesso para clientes que ainda não têm.
 * Protegido por CRON_SECRET — chamado periodicamente pelo cron da Vercel
 * (vercel.json) e também pode ser disparado manualmente com o header certo.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_PORTAL_BASE_URL || "http://localhost:3000";
  const semLink = await listClientesSemLink();

  if (semLink.length === 0) {
    return NextResponse.json({ gerados: 0, clientes: [] });
  }

  const todos = await listClientes();
  const slugsJaUsados = todos
    .map((c) => {
      const match = c.linkAcesso?.match(/\/cliente\/([^?]+)/);
      return match?.[1];
    })
    .filter((s): s is string => Boolean(s));

  const gerados: { nome: string; url: string }[] = [];
  for (const cliente of semLink) {
    const { slug, url } = montarLinkDoPortal(baseUrl, cliente.nome, slugsJaUsados);
    slugsJaUsados.push(slug);
    await salvarLinkDoCliente(cliente.id, url);
    gerados.push({ nome: cliente.nome, url });
  }

  return NextResponse.json({ gerados: gerados.length, clientes: gerados });
}
