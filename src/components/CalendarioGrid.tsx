"use client";

import { useState } from "react";
import { montarGradeDoCiclo, corDoFormato } from "@/lib/calendario";
import type { PostCalendario } from "@/lib/notion";

const DIAS_SEMANA = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

function montarTextoParaIA(post: PostCalendario): string {
  const linhas: string[] = [];
  linhas.push(
    `Quero criar um post de ${post.formato ?? "Instagram"} para as minhas redes sociais. Me ajude a escrever o conteúdo no meu tom de voz, com base no tema e nas orientações abaixo.`
  );
  linhas.push("");
  linhas.push(`TEMA: ${post.direcionamentoTema ?? ""}`);
  const blocos = (post.comoUsar ?? []).filter((b) => b.texto.toLowerCase() !== "como usar este tema");
  if (blocos.length > 0) {
    linhas.push("");
    linhas.push("ORIENTAÇÕES:");
    for (const b of blocos) {
      if (b.tipo === "titulo") linhas.push(`\n${b.texto}:`);
      else if (b.tipo === "item") linhas.push(`- ${b.texto}`);
      else if (b.rotulo) linhas.push(`${b.rotulo}: ${b.texto}`);
      else linhas.push(b.texto);
    }
  }
  return linhas.join("\n");
}

export default function CalendarioGrid({ posts }: { posts: PostCalendario[] }) {
  const semanas = montarGradeDoCiclo(posts);
  const [postSelecionado, setPostSelecionado] = useState<PostCalendario | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function copiarParaIA(post: PostCalendario) {
    const texto = montarTextoParaIA(post);
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const area = document.createElement("textarea");
      area.value = texto;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  if (semanas.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
        Seu calendário deste ciclo ainda está sendo gerado.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-neutral-200">
        <div className="grid grid-cols-7 bg-amrs-preto text-white">
          {DIAS_SEMANA.map((d) => (
            <div key={d} className="px-3 py-2 text-center text-xs font-bold tracking-wide">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {semanas.flat().map((dia, i) => (
            <div
              key={i}
              className={`min-h-[110px] border-b border-r border-neutral-200 p-2 ${
                dia.dentroDoCiclo ? "bg-white" : "bg-neutral-50"
              }`}
            >
              <div
                className={`mb-1 text-xs font-semibold ${
                  dia.dentroDoCiclo ? "text-neutral-900" : "text-neutral-400"
                }`}
              >
                {dia.data.getDate()}
              </div>
              <div className="flex flex-col gap-1">
                {dia.posts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPostSelecionado(p)}
                    className={`truncate rounded-md px-2 py-1 text-left text-[11px] font-semibold ${corDoFormato(
                      p.formato
                    )}`}
                    title={p.direcionamentoTema || `${p.formato ?? ""} — ${p.editoria ?? ""}`}
                  >
                    {p.formato ?? "Post"}
                  </button>
                ))}
                {dia.posts.some((p) => p.feriado) && (
                  <div className="truncate rounded-md bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800">
                    feriado
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {postSelecionado && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-6"
          onClick={() => setPostSelecionado(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`rounded-md px-2 py-1 text-xs font-bold ${corDoFormato(
                  postSelecionado.formato
                )}`}
              >
                {postSelecionado.formato ?? "Post"}
              </span>
              <button
                onClick={() => setPostSelecionado(null)}
                className="text-sm font-semibold text-neutral-400 hover:text-neutral-700"
              >
                Fechar
              </button>
            </div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wide text-neutral-400">
              {postSelecionado.editoria ?? "Editoria"}
              {postSelecionado.objetivo ? ` · ${postSelecionado.objetivo}` : ""}
            </div>
            {postSelecionado.data && (
              <div className="mb-3 text-xs text-neutral-400">
                {new Date(postSelecionado.data + "T00:00:00").toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                })}
              </div>
            )}
            <div className="text-sm font-medium text-amrs-preto">
              {postSelecionado.direcionamentoTema || "Sem sugestão de tema cadastrada ainda."}
            </div>
            {postSelecionado.comoUsar && postSelecionado.comoUsar.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
                {postSelecionado.comoUsar.map((b, i) =>
                  b.tipo === "titulo" ? (
                    <div
                      key={i}
                      className="pt-2 text-xs font-bold uppercase tracking-wide text-amrs-laranja"
                    >
                      {b.texto}
                    </div>
                  ) : b.rotulo ? (
                    <p key={i} className="text-sm text-neutral-700">
                      <span className="font-bold text-amrs-preto">{b.rotulo}: </span>
                      {b.texto}
                    </p>
                  ) : b.tipo === "item" ? (
                    <div key={i} className="flex gap-2 text-sm text-neutral-700">
                      <span className="text-amrs-laranja">•</span>
                      <span>{b.texto}</span>
                    </div>
                  ) : (
                    <p key={i} className="text-sm text-neutral-700">
                      {b.texto}
                    </p>
                  )
                )}
              </div>
            )}
            <button
              onClick={() => copiarParaIA(postSelecionado)}
              className="mt-5 w-full rounded-full bg-amrs-preto px-5 py-3 text-xs font-bold text-white hover:bg-neutral-800"
            >
              {copiado ? "Copiado ✓ Agora é só colar na sua IA" : "Copiar tema para usar na IA"}
            </button>
            {postSelecionado.feriado && (
              <div className="mt-3 inline-block rounded-md bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-800">
                Data comemorativa
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
