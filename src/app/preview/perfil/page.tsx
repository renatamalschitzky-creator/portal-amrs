import { BLOCOS } from "@/lib/briefing-perguntas";

export default function PreviewPerfil() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between bg-amrs-preto px-8 py-4 text-white">
        <span className="text-sm font-semibold text-neutral-300">← Voltar ao calendário</span>
        <div className="text-lg font-black tracking-wide">
          AMRS<span className="text-amrs-laranja">.</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-10">
        <h1 className="mb-1 text-2xl font-black text-amrs-preto">Meu Perfil</h1>
        <p className="mb-8 text-sm font-light text-neutral-500">
          Responda com calma — quanto mais completo, melhor fica o resultado final.
        </p>

        <div className="flex flex-col gap-10">
          {BLOCOS.slice(0, 1).map((bloco) => (
            <div key={bloco.id} className="flex flex-col gap-5">
              <h2 className="text-lg font-black text-amrs-preto">{bloco.titulo}</h2>
              {bloco.perguntas.slice(0, 3).map((p, i) => (
                <div key={p.id} className="rounded-2xl border border-neutral-200 p-5 shadow-sm">
                  <div className="mb-2 flex gap-3">
                    <span className="min-w-[20px] font-black text-amrs-laranja">{i + 1}</span>
                    <div>
                      <div className="font-semibold text-amrs-preto">{p.texto}</div>
                      {p.ajuda && <div className="text-xs text-neutral-500">{p.ajuda}</div>}
                    </div>
                  </div>
                  <textarea
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm"
                    rows={3}
                    placeholder="Escreva sua resposta aqui..."
                    defaultValue={i === 0 ? "Instagram e LinkedIn" : ""}
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-neutral-200 py-4">
            <div className="text-xs text-neutral-500">
              Lembrando: esse formulário é preenchido uma única vez — pra mudar qualquer resposta
              depois, você vai precisar preencher tudo de novo.
            </div>
            <button className="whitespace-nowrap rounded-full bg-amrs-laranja px-8 py-3 text-sm font-bold text-white">
              Concluir briefing →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
