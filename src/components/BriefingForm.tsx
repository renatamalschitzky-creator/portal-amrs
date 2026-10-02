"use client";

import { useState, useTransition } from "react";
import { BLOCOS, TOTAL_PERGUNTAS } from "@/lib/briefing-perguntas";
import { salvarBriefing, salvarProgresso } from "@/lib/actions";

export default function BriefingForm({
  slug,
  token,
  respostasIniciais = {},
}: {
  slug: string;
  token: string;
  respostasIniciais?: Record<string, string>;
}) {
  const [respostas, setRespostas] = useState<Record<string, string>>(respostasIniciais);
  const [pending, startTransition] = useTransition();
  const [confirmando, setConfirmando] = useState(false);
  const [statusSalvar, setStatusSalvar] = useState<"idle" | "salvando" | "salvo">("idle");

  const respondidas = Object.values(respostas).filter((v) => v?.trim()).length;

  function atualizar(id: string, valor: string) {
    setRespostas((r) => ({ ...r, [id]: valor }));
    setStatusSalvar("idle");
  }

  function salvarProgressoAgora() {
    setStatusSalvar("salvando");
    startTransition(async () => {
      await salvarProgresso(slug, token, respostas);
      setStatusSalvar("salvo");
    });
  }

  function enviar() {
    startTransition(() => {
      salvarBriefing(slug, token, respostas);
    });
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="sticky top-0 z-10 -mx-8 flex items-center justify-between bg-white/95 px-8 py-3 backdrop-blur">
        <div className="text-xs font-semibold text-neutral-500">
          {respondidas} de {TOTAL_PERGUNTAS} perguntas respondidas
        </div>
        <button
          onClick={salvarProgressoAgora}
          disabled={pending}
          className="rounded-full border border-amrs-preto px-5 py-2 text-xs font-bold text-amrs-preto disabled:opacity-50"
        >
          {statusSalvar === "salvo"
            ? "Progresso salvo ✓"
            : statusSalvar === "salvando"
              ? "Salvando..."
              : "Salvar e continuar depois"}
        </button>
      </div>

      <p className="-mt-6 text-xs text-neutral-400">
        Pode responder aos poucos — seu progresso fica salvo e você continua de onde parou quando
        quiser.
      </p>

      {BLOCOS.map((bloco) => (
        <div key={bloco.id} className="flex flex-col gap-5">
          <h2 className="text-lg font-black text-amrs-preto">{bloco.titulo}</h2>
          {bloco.perguntas.map((p, i) => (
            <div
              key={p.id}
              className="rounded-2xl border border-neutral-200 p-5 shadow-sm"
            >
              <div className="mb-2 flex gap-3">
                <span className="min-w-[20px] font-black text-amrs-laranja">{i + 1}</span>
                <div>
                  <div className="font-semibold text-amrs-preto">{p.texto}</div>
                  {p.ajuda && <div className="text-xs text-neutral-500">{p.ajuda}</div>}
                </div>
              </div>
              <textarea
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm focus:border-amrs-laranja focus:outline-none"
                rows={3}
                placeholder="Escreva sua resposta aqui..."
                value={respostas[p.id] ?? ""}
                onChange={(e) => atualizar(p.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}

      <div className="sticky bottom-0 flex items-center justify-between border-t border-neutral-200 bg-white/95 py-4 backdrop-blur">
        <div className="text-xs text-neutral-500">
          Quando clicar em &quot;Concluir&quot;, o briefing fecha — pra mudar depois, só
          preenchendo tudo de novo.
        </div>
        {!confirmando ? (
          <button
            onClick={() => setConfirmando(true)}
            className="whitespace-nowrap rounded-full bg-amrs-laranja px-8 py-3 text-sm font-bold text-white"
          >
            Concluir briefing →
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-amrs-vinho">Confirma o envio?</span>
            <button
              onClick={enviar}
              disabled={pending}
              className="rounded-full bg-amrs-vinho px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {pending ? "Enviando..." : "Sim, enviar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
