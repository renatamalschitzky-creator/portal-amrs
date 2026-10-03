import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export const DB = {
  clientes: process.env.NOTION_DB_CLIENTES || "4e5b0816-832a-4858-8448-d177e2f541b3",
  briefings: process.env.NOTION_DB_BRIEFINGS || "fcabbcca-49be-4c39-9981-326cae801e2f",
  mapa3d: process.env.NOTION_DB_MAPA3D || "310c6b7c-21d7-4cff-ab55-7def76a30b73",
  linhaEditorial:
    process.env.NOTION_DB_LINHA_EDITORIAL || "c889b3f8-f93f-4449-ae76-f9e433448331",
  calendario: process.env.NOTION_DB_CALENDARIO || "05688e71-74ae-4eb3-bcb7-b7a0fb58b4bc",
};

export type StatusCliente = "Ativo" | "Pausado" | "Encerrado";

export type ObjetivoDoMes = "Atração" | "Qualificação" | "Conversão";

export type Cliente = {
  id: string;
  nome: string;
  status: StatusCliente;
  dataInicio?: string;
  dataRenovacao?: string;
  nivelEntrega?: string;
  linkAcesso?: string;
  instagram?: string;
  pastaMateriais?: string;
  objetivoDoMes?: ObjetivoDoMes;
  diasDePostagem: string[];
  postsPorSemana?: number;
  temaDoMes?: string;
};

export type PostCalendario = {
  id: string;
  data?: string;
  editoria?: string;
  formato?: string;
  objetivo?: string;
  status?: string;
  ciclo?: string;
  feriado: boolean;
  direcionamentoTema?: string;
};

export type Briefing = {
  id: string;
  nivelPreenchimento?: "Excelente" | "Médio" | "Raso";
  status?: "Rascunho" | "Completo" | "Desatualizado";
  respostas: Record<string, string>;
};

// ---- helpers para ler as propriedades do Notion ----

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function title(prop: any): string {
  return prop?.title?.map((t: any) => t.plain_text).join("") ?? "";
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function select(prop: any): string | undefined {
  return prop?.select?.name;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function url(prop: any): string | undefined {
  return prop?.url ?? undefined;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function date(prop: any): string | undefined {
  return prop?.date?.start ?? undefined;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkbox(prop: any): boolean {
  return Boolean(prop?.checkbox);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function richText(prop: any): string {
  return prop?.rich_text?.map((t: any) => t.plain_text).join("") ?? "";
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function multiSelect(prop: any): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return prop?.multi_select?.map((o: any) => o.name) ?? [];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function number(prop: any): number | undefined {
  return typeof prop?.number === "number" ? prop.number : undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCliente(page: any): Cliente {
  const p = page.properties;
  return {
    id: page.id,
    nome: title(p["Nome/Marca"]),
    status: (select(p["Status"]) as StatusCliente) ?? "Encerrado",
    dataInicio: date(p["Data de início"]),
    dataRenovacao: date(p["Data de renovação"]),
    nivelEntrega: select(p["Nível de entrega"]),
    linkAcesso: url(p["Link de acesso (Portal)"]),
    instagram: url(p["Instagram"]),
    pastaMateriais: url(p["Pasta de materiais (Drive)"]),
    objetivoDoMes: select(p["Objetivo do mês"]) as ObjetivoDoMes | undefined,
    diasDePostagem: multiSelect(p["Dias de postagem"]),
    postsPorSemana: number(p["Posts por semana"]),
    temaDoMes: richText(p["Tema do mês"]) || undefined,
  };
}

/**
 * Salva a Configuração do mês definida pelo cliente (objetivo, dias de
 * postagem, quantidade de posts por semana e tema opcional). Não gera
 * calendário sozinho — isso fica para a etapa do motor de geração por IA.
 */
export async function salvarConfiguracaoDoMes(
  clienteId: string,
  config: {
    objetivo: ObjetivoDoMes;
    diasDePostagem: string[];
    postsPorSemana: number;
    temaDoMes?: string;
  }
): Promise<void> {
  await notion.pages.update({
    page_id: clienteId,
    properties: {
      "Objetivo do mês": { select: { name: config.objetivo } },
      "Dias de postagem": { multi_select: config.diasDePostagem.map((nome) => ({ name: nome })) },
      "Posts por semana": { number: config.postsPorSemana },
      "Tema do mês": { rich_text: config.temaDoMes ? [{ text: { content: config.temaDoMes } }] : [] },
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(page: any): PostCalendario {
  const p = page.properties;
  return {
    id: page.id,
    data: date(p["Data"]),
    editoria: select(p["Editoria"]),
    formato: select(p["Formato"]),
    objetivo: select(p["Objetivo"]),
    status: select(p["Status"]),
    ciclo: richText(p["Ciclo"]),
    feriado: checkbox(p["É feriado/data comemorativa"]),
    direcionamentoTema: richText(p["Direcionamento de tema"]),
  };
}

/**
 * Encontra o cliente cujo link de acesso contém o token da URL, e confere
 * que o slug bate com o link salvo (segurança extra contra slug/token trocados).
 */
export async function findClienteBySlugAndToken(
  slug: string,
  token: string
): Promise<Cliente | null> {
  const res = await notion.dataSources.query({
    data_source_id: DB.clientes,
    filter: {
      property: "Link de acesso (Portal)",
      url: { contains: token },
    },
  });
  if (res.results.length === 0) return null;
  const cliente = mapCliente(res.results[0]);
  if (!cliente.linkAcesso || !cliente.linkAcesso.includes(`/cliente/${slug}`)) {
    return null;
  }
  return cliente;
}

export async function getCalendarioDoCliente(clienteId: string): Promise<PostCalendario[]> {
  const res = await notion.dataSources.query({
    data_source_id: DB.calendario,
    filter: {
      property: "Cliente",
      relation: { contains: clienteId },
    },
    sorts: [{ property: "Data", direction: "ascending" }],
  });
  return res.results.map(mapPost);
}

function parseRespostas(json: string): Record<string, string> {
  if (!json) return {};
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

/**
 * Busca o Briefing mais recente do cliente (rascunho ou completo).
 * Um cliente pode ter mais de um registro (ex: refez o briefing do zero);
 * ficamos sempre com o mais recente.
 */
export async function getBriefingDoCliente(clienteId: string): Promise<Briefing | null> {
  const res = await notion.dataSources.query({
    data_source_id: DB.briefings,
    filter: {
      property: "Cliente",
      relation: { contains: clienteId },
    },
    sorts: [{ property: "Data de preenchimento", direction: "descending" }],
  });
  if (res.results.length === 0) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const page = res.results[0] as any;
  const p = page.properties;
  return {
    id: page.id,
    nivelPreenchimento: select(p["Nível de preenchimento"]) as Briefing["nivelPreenchimento"],
    status: select(p["Status"]) as Briefing["status"],
    respostas: parseRespostas(richText(p["Respostas (rascunho)"])),
  };
}

function textoEmChunks(texto: string) {
  const TAMANHO = 1900;
  const partes: { type: "text"; text: { content: string } }[] = [];
  for (let i = 0; i < texto.length; i += TAMANHO) {
    partes.push({ type: "text", text: { content: texto.slice(i, i + TAMANHO) } });
  }
  return partes.length > 0 ? partes : [{ type: "text" as const, text: { content: "" } }];
}

/**
 * Salva o progresso do briefing (rascunho) — cria o registro na primeira vez,
 * atualiza nas vezes seguintes. Não mexe no Status se já estiver Completo
 * (proteção extra contra sobrescrever um briefing já fechado).
 */
export async function salvarRascunhoBriefing(
  clienteId: string,
  clienteNome: string,
  briefingIdExistente: string | undefined,
  respostas: Record<string, string>
): Promise<string> {
  const json = JSON.stringify(respostas);
  const hoje = new Date().toISOString().slice(0, 10);

  if (briefingIdExistente) {
    await notion.pages.update({
      page_id: briefingIdExistente,
      properties: {
        "Respostas (rascunho)": { rich_text: textoEmChunks(json) },
        "Data de preenchimento": { date: { start: hoje } },
      },
    });
    return briefingIdExistente;
  }

  const pagina = await notion.pages.create({
    parent: { type: "data_source_id", data_source_id: DB.briefings },
    properties: {
      Name: { title: [{ text: { content: `Briefing — ${clienteNome} — ${hoje}` } }] },
      Cliente: { relation: [{ id: clienteId }] },
      Status: { select: { name: "Rascunho" } },
      "Data de preenchimento": { date: { start: hoje } },
      "Respostas (rascunho)": { rich_text: textoEmChunks(json) },
    },
  });
  return pagina.id;
}

/**
 * Fecha o briefing: marca como Completo, grava o nível de preenchimento e
 * escreve o conteúdo final legível no corpo da página.
 */
export async function concluirBriefing(
  briefingId: string,
  nivel: "Excelente" | "Médio" | "Raso",
  markdown: string
): Promise<void> {
  await notion.pages.update({
    page_id: briefingId,
    properties: {
      Status: { select: { name: "Completo" } },
      "Nível de preenchimento": { select: { name: nivel } },
      "Data de preenchimento": { date: { start: new Date().toISOString().slice(0, 10) } },
    },
  });
  await notion.blocks.children.append({
    block_id: briefingId,
    children: markdownParaBlocos(markdown),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function markdownParaBlocos(markdown: string): any[] {
  return markdown
    .split("\n")
    .filter((linha) => linha.trim().length > 0)
    .map((linha) => {
      if (linha.startsWith("## ")) {
        return {
          object: "block",
          type: "heading_2",
          heading_2: { rich_text: [{ type: "text", text: { content: linha.slice(3) } }] },
        };
      }
      const negrito = linha.startsWith("**") && linha.endsWith("**");
      const texto = negrito ? linha.slice(2, -2) : linha;
      return {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            { type: "text", text: { content: texto }, annotations: { bold: negrito } },
          ],
        },
      };
    });
}

export async function listClientesSemLink(): Promise<Cliente[]> {
  const res = await notion.dataSources.query({
    data_source_id: DB.clientes,
    filter: {
      property: "Link de acesso (Portal)",
      url: { is_empty: true },
    },
  });
  return res.results.map(mapCliente);
}

export async function listClientes(): Promise<Cliente[]> {
  const res = await notion.dataSources.query({ data_source_id: DB.clientes });
  return res.results.map(mapCliente);
}

export async function salvarLinkDoCliente(clienteId: string, link: string): Promise<void> {
  await notion.pages.update({
    page_id: clienteId,
    properties: {
      "Link de acesso (Portal)": { url: link },
    },
  });
}
