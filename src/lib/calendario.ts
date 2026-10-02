import type { PostCalendario } from "./notion";

export type DiaDoCalendario = {
  data: Date;
  noMes: boolean; // não usado mais (mantido por clareza do range do ciclo)
  dentroDoCiclo: boolean;
  posts: PostCalendario[];
};

const UM_DIA = 24 * 60 * 60 * 1000;

function inicioDaSemana(d: Date): Date {
  // Semana começa na segunda-feira
  const dia = (d.getDay() + 6) % 7; // 0 = segunda
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - dia);
}

/**
 * Monta a grade de semanas (segunda a domingo) cobrindo do primeiro ao
 * último post do ciclo, no estilo Google Calendar.
 */
export function montarGradeDoCiclo(posts: PostCalendario[]): DiaDoCalendario[][] {
  const datasValidas = posts
    .map((p) => (p.data ? new Date(p.data + "T00:00:00") : null))
    .filter((d): d is Date => d !== null);

  if (datasValidas.length === 0) return [];

  const minData = new Date(Math.min(...datasValidas.map((d) => d.getTime())));
  const maxData = new Date(Math.max(...datasValidas.map((d) => d.getTime())));

  const inicioGrade = inicioDaSemana(minData);
  const fimSemanaFinal = inicioDaSemana(maxData);
  const fimGrade = new Date(fimSemanaFinal.getTime() + 6 * UM_DIA);

  const postsPorDia = new Map<string, PostCalendario[]>();
  for (const p of posts) {
    if (!p.data) continue;
    const key = p.data;
    if (!postsPorDia.has(key)) postsPorDia.set(key, []);
    postsPorDia.get(key)!.push(p);
  }

  const semanas: DiaDoCalendario[][] = [];
  let cursor = new Date(inicioGrade);
  let semanaAtual: DiaDoCalendario[] = [];

  while (cursor.getTime() <= fimGrade.getTime()) {
    const key = cursor.toISOString().slice(0, 10);
    semanaAtual.push({
      data: new Date(cursor),
      noMes: true,
      dentroDoCiclo: cursor >= minData && cursor <= maxData,
      posts: postsPorDia.get(key) ?? [],
    });
    if (semanaAtual.length === 7) {
      semanas.push(semanaAtual);
      semanaAtual = [];
    }
    cursor = new Date(cursor.getTime() + UM_DIA);
  }
  if (semanaAtual.length > 0) semanas.push(semanaAtual);

  return semanas;
}

export function corDoFormato(formato?: string): string {
  switch (formato) {
    case "Reels":
      return "bg-amrs-laranja text-white";
    case "Carrossel":
      return "bg-amrs-vinho text-white";
    case "Estático":
      return "bg-neutral-700 text-white";
    default:
      return "bg-neutral-300 text-neutral-800";
  }
}
