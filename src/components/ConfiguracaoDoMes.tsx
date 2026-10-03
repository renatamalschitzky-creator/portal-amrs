"use client";

import { useState, useTransition } from "react";
import { salvarConfiguracao } from "@/lib/actions";
import type { ObjetivoDoMes } from "@/lib/notion";

const OBJETIVOS: ObjetivoDoMes[] = ["Atração", "Qualificação", "Conversão"];
const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function ConfiguracaoDoMes({
  slug,
  token,
  ciclo,
  objetivoAtual,
  diasAtuais,
  postsPorSemanaAtual,
  temaAtual,
}: {
  slug: string;
  token: string;
  ciclo?: string;
  objetivoAtual?: ObjetivoDoMes;
  diasAtuais: string[];
  postsPorSemanaAtual?: number;
  temaAtual?: string;
}) {
  const [editando, setEditando] = useState(false);
  const [objetivo, setObjetivo] = useState<ObjetivoDoMes>(objetivoAtual ?? "Atração");
  const [dias, setDias] = useState<string[]>(diasAtuais);
  const [postsPorSemana, setPostsPorSemana] = useState(postsPorSemanaAtual ?? 3);
  const [tema, setTema] = useState(temaAtual ?? "");
  const [pending, startTransition] = useTransition();
  const [salvo, setSalvo] = useState(false);

  function alternarDia(dia: string) {
    setDias((d) => (d.includes(dia) ? d.filter((x) => x !== dia) : [...d, dia]));
    setSalvo(false);
  }

  function salvar() {
    startTransition(async () => {
      await salvarConfiguracao(slug, token, {
        objetivo,
        diasDePostagem: dias,
        postsPorSemana,
        temaDoMes: tema || undefined,
      });
      setSalvo(true);
      setEditando(false);
    });
  }

  if (!editando) {
    return (
      <div className="mb-8 flex flex-col gap-2 rounded-2xl bg-amrs-vinho p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-white/70">
              Configuração do mês
            </div>
            <div className="text-2xl font-black">{ciclo || "Ciclo atual"}</div>
          </div>
          <button
            onClick={() => setEditando(true)}
            className="shrink-0 whitespace-nowrap rounded-full border border-white/40 px-4 py-2 text-xs font-bold hover:bg-white/10"
          >
            Editar
          </button>
        </div>
        <div className="text-sm font-light text-white/80">
          Objetivo: <span className="font-semibold">{objetivoAtual ?? "— ainda não definido"}</span>
        </div>
        <div className="text-sm font-light text-white/80">
          Dias de postagem:{" "}
          <span className="font-semibold">
            {diasAtuais.length > 0 ? diasAtuais.join(", ") : "— ainda não definido"}
          </span>
        </div>
        <div className="text-sm font-light text-white/80">
          Posts por semana:{" "}
          <span className="font-semibold">{postsPorSemanaAtual ?? "— ainda não definido"}</span>
        </div>
        {temaAtual && (
          <div className="text-sm font-light text-white/80">
            Tema do mês: <span className="font-semibold">{temaAtual}</span>
          </div>
        )}
        {salvo && (
          <div className="mt-1 text-xs font-semibold text-emerald-300">
            Configuração salva ✓ — sua equipe vai usar isso no próximo calendário.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-amrs-vinho p-6 text-white">
      <div className="text-xs font-bold uppercase tracking-wide text-white/70">
        Configuração do mês
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold text-white/70">Objetivo</div>
        <div className="flex flex-wrap gap-2">
          {OBJETIVOS.map((o) => (
            <button
              key={o}
              onClick={() => setObjetivo(o)}
              className={`rounded-full px-4 py-2 text-xs font-bold ${
                objetivo === o ? "bg-white text-amrs-vinho" : "border border-white/40 text-white"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold text-white/70">Dias de postagem</div>
        <div className="flex flex-wrap gap-2">
          {DIAS.map((d) => (
            <button
              key={d}
              onClick={() => alternarDia(d)}
              className={`rounded-full px-4 py-2 text-xs font-bold ${
                dias.includes(d) ? "bg-white text-amrs-vinho" : "border border-white/40 text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[200px]">
        <div className="mb-2 text-xs font-semibold text-white/70">Posts por semana</div>
        <input
          type="number"
          min={1}
          max={14}
          value={postsPorSemana}
          onChange={(e) => setPostsPorSemana(Number(e.target.value))}
          className="w-full rounded-lg border border-white/40 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50"
        />
      </div>

      <div>
        <div className="mb-2 text-xs font-semibold text-white/70">
          Tema do mês <span className="font-normal text-white/50">(opcional)</span>
        </div>
        <input
          type="text"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          placeholder="Ex: lançamento do produto X"
          className="w-full rounded-lg border border-white/40 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={salvar}
          disabled={pending || dias.length === 0}
          className="rounded-full bg-white px-6 py-2 text-xs font-bold text-amrs-vinho disabled:opacity-50"
        >
          {pending ? "Salvando..." : "Salvar configuração"}
        </button>
        <button
          onClick={() => setEditando(false)}
          className="text-xs font-semibold text-white/70 hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
