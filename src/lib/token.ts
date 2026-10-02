import { randomBytes } from "crypto";

/** Transforma "AMRS Business (teste)" em "amrs-business-teste" */
export function slugify(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 30);
}

export function gerarToken(): string {
  return randomBytes(16).toString("hex");
}

/**
 * Monta o link único e definitivo de um cliente.
 * O slug não precisa ser secreto (fica visível na URL) — quem garante o
 * acesso é o token longo e aleatório no parâmetro `token`.
 */
export function montarLinkDoPortal(
  baseUrl: string,
  nome: string,
  slugsJaUsados: string[]
): { slug: string; token: string; url: string } {
  const base = slugify(nome) || "cliente";
  let slug = base;
  let i = 2;
  while (slugsJaUsados.includes(slug)) {
    slug = `${base}-${i++}`;
  }
  const token = gerarToken();
  const url = `${baseUrl.replace(/\/$/, "")}/cliente/${slug}?token=${token}`;
  return { slug, token, url };
}
