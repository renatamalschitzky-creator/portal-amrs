"use server";

import { redirect } from "next/navigation";
import {
  findClienteBySlugAndToken,
  getBriefingDoCliente,
  salvarRascunhoBriefing,
  concluirBriefing,
  salvarConfiguracaoDoMes,
  type ObjetivoDoMes,
} from "./notion";
import { BLOCOS, TOTAL_PERGUNTAS } from "./briefing-perguntas";

function calcularNivel(respostas: Record<string, string>): "Excelente" | "Médio" | "Raso" {
  const preenchidas = Object.values(respostas).filter((v) => v && v.trim().length > 0);
  const proporcao = preenchidas.length / TOTAL_PERGUNTAS;
  const mediaCaracteres =
    preenchidas.reduce((acc, v) => acc + v.trim().length, 0) / Math.max(preenchidas.length, 1);

  if (proporcao >= 0.9 && mediaCaracteres >= 60) return "Excelente";
  if (proporcao >= 0.6) return "Médio";
  return "Raso";
}

function montarMarkdown(respostas: Record<string, string>): string {
  const partes: string[] = [];
  for (const bloco of BLOCOS) {
    partes.push(`## ${bloco.titulo}\n`);
    for (const pergunta of bloco.perguntas) {
      const resposta = respostas[pergunta.id]?.trim();
      partes.push(`**${pergunta.texto}**`);
      partes.push(resposta ? resposta : "_(não respondido)_");
      partes.push("");
    }
  }
  return partes.join("\n");
}

/** Salva o progresso (rascunho) — pode ser chamado várias vezes, a qualquer momento. */
export async function salvarProgresso(
  slug: string,
  token: string,
  respostas: Record<string, string>
): Promise<{ ok: boolean }> {
  const cliente = await findClienteBySlugAndToken(slug, token);
  if (!cliente) return { ok: false };

  const briefingAtual = await getBriefingDoCliente(cliente.id);
  const idParaAtualizar = briefingAtual?.status === "Completo" ? undefined : briefingAtual?.id;

  await salvarRascunhoBriefing(cliente.id, cliente.nome, idParaAtualizar, respostas);
  return { ok: true };
}

/** Fecha o briefing definitivamente. A partir daqui, só refazendo tudo de novo. */
export async function salvarBriefing(
  slug: string,
  token: string,
  respostas: Record<string, string>
) {
  const cliente = await findClienteBySlugAndToken(slug, token);
  if (!cliente) throw new Error("Acesso inválido");

  const briefingAtual = await getBriefingDoCliente(cliente.id);
  const idParaAtualizar = briefingAtual?.status === "Completo" ? undefined : briefingAtual?.id;

  const briefingId = await salvarRascunhoBriefing(
    cliente.id,
    cliente.nome,
    idParaAtualizar,
    respostas
  );

  const nivel = calcularNivel(respostas);
  const markdown = montarMarkdown(respostas);
  await concluirBriefing(briefingId, nivel, markdown);

  redirect(`/cliente/${slug}?token=${token}&briefing=salvo`);
}

/**
 * Salva a Configuração do mês (objetivo, dias de postagem, quantidade de
 * posts e tema opcional). Ainda não dispara geração nenhuma — só grava.
 */
export async function salvarConfiguracao(
  slug: string,
  token: string,
  config: {
    objetivo: ObjetivoDoMes;
    diasDePostagem: string[];
    postsPorSemana: number;
    temaDoMes?: string;
  }
): Promise<{ ok: boolean }> {
  const cliente = await findClienteBySlugAndToken(slug, token);
  if (!cliente) return { ok: false };

  await salvarConfiguracaoDoMes(cliente.id, config);
  return { ok: true };
}
