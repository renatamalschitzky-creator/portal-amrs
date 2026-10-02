/**
 * Gera o link de acesso (slug + token) para todo cliente que ainda não tem
 * um salvo no campo "Link de acesso (Portal)", e grava de volta no Notion.
 *
 * Uso: npx tsx scripts/gerar-links.ts
 *
 * Mais pra frente, esse mesmo código roda sozinho (webhook/automação) no
 * momento em que um cliente novo é cadastrado como Ativo — e dispara o
 * e-mail automático com o link.
 */
import { listClientes, listClientesSemLink, salvarLinkDoCliente } from "../src/lib/notion";
import { montarLinkDoPortal } from "../src/lib/token";

async function main() {
  const baseUrl = process.env.NEXT_PUBLIC_PORTAL_BASE_URL || "https://clube.aminharedesocial.com.br";

  const todos = await listClientes();
  const slugsJaUsados = todos
    .map((c) => c.linkAcesso?.match(/\/cliente\/([^/?]+)/)?.[1])
    .filter((s): s is string => Boolean(s));

  const pendentes = await listClientesSemLink();

  if (pendentes.length === 0) {
    console.log("Todos os clientes já têm link de acesso.");
    return;
  }

  for (const cliente of pendentes) {
    const { slug, url } = montarLinkDoPortal(baseUrl, cliente.nome, slugsJaUsados);
    slugsJaUsados.push(slug);
    await salvarLinkDoCliente(cliente.id, url);
    console.log(`✔ ${cliente.nome} → ${url}`);
    // TODO: disparar e-mail automático pro cliente aqui, quando o envio
    // de e-mail transacional estiver configurado (Resend, Postmark, etc.)
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
