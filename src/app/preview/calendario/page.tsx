import CalendarioGrid from "@/components/CalendarioGrid";
import type { PostCalendario } from "@/lib/notion";

const FORMATOS = ["Reels", "Carrossel", "Estático"] as const;
const EDITORIAS = ["Institucional", "Exclusivo", "Universal", "Produto/Serviço"] as const;

function gerarPostsMock(): PostCalendario[] {
  const diasComPost = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29, 31];
  return diasComPost.map((dia, i) => {
    const mes = dia <= 31 ? "10" : "11";
    const diaReal = dia > 31 ? dia - 31 : dia;
    return {
      id: `mock-${i}`,
      data: `2026-${mes}-${String(diaReal).padStart(2, "0")}`,
      editoria: EDITORIAS[i % EDITORIAS.length],
      formato: FORMATOS[i % FORMATOS.length],
      objetivo: i % 3 === 0 ? "Atração" : i % 3 === 1 ? "Qualificação" : "Conversão",
      status: "A produzir",
      ciclo: "03/10 — 01/11",
      feriado: dia === 12 || dia === 31,
      direcionamentoTema: "",
    };
  });
}

export default function PreviewCalendario() {
  const posts = gerarPostsMock();
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between bg-amrs-preto px-8 py-4 text-white">
        <div className="text-lg font-black tracking-wide">
          AMRS<span className="text-amrs-laranja">.</span>
        </div>
        <div className="text-sm font-light text-neutral-300">Clube de Assinatura</div>
        <div className="rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-semibold text-emerald-400">
          Ativo
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl gap-10 px-8 py-10">
        <div className="flex-1">
          <div className="mb-8 flex flex-col gap-2 rounded-2xl bg-amrs-vinho p-6 text-white">
            <div className="text-xs font-bold uppercase tracking-wide text-white/70">
              Configuração do mês
            </div>
            <div className="text-2xl font-black">03/10 — 01/11</div>
            <div className="text-sm font-light text-white/80">
              Objetivo: <span className="font-semibold">Atração</span>
            </div>
          </div>

          <h1 className="mb-4 text-xl font-black text-amrs-preto">Olá, AMRS Business 👋</h1>

          <CalendarioGrid posts={posts} />
        </div>

        <aside className="w-64 shrink-0 space-y-4">
          <a className="block rounded-2xl border border-neutral-200 p-5 hover:border-amrs-laranja">
            <div className="text-sm font-bold text-amrs-preto">Meu Perfil</div>
            <div className="text-xs text-neutral-500">Completo</div>
          </a>
          <a className="block rounded-2xl border border-neutral-200 p-5 hover:border-amrs-laranja">
            <div className="text-sm font-bold text-amrs-preto">Materiais</div>
            <div className="text-xs text-neutral-500">Enviar arquivos</div>
          </a>
        </aside>
      </main>
    </div>
  );
}
