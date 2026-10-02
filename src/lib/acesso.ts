import { findClienteBySlugAndToken, type Cliente } from "./notion";

export type ResultadoAcesso =
  | { ok: true; cliente: Cliente }
  | { ok: false; motivo: "sem-token" | "invalido" | "bloqueado"; cliente?: Cliente };

export async function validarAcesso(
  slug: string,
  token: string | undefined
): Promise<ResultadoAcesso> {
  if (!token) return { ok: false, motivo: "sem-token" };
  const cliente = await findClienteBySlugAndToken(slug, token);
  if (!cliente) return { ok: false, motivo: "invalido" };
  if (cliente.status !== "Ativo") return { ok: false, motivo: "bloqueado", cliente };
  return { ok: true, cliente };
}
