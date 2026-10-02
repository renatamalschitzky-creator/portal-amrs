export default function PreviewMateriais() {
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between bg-amrs-preto px-8 py-4 text-white">
        <span className="text-sm font-semibold text-neutral-300">← Voltar ao calendário</span>
        <div className="text-lg font-black tracking-wide">
          AMRS<span className="text-amrs-laranja">.</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-8 py-10">
        <h1 className="mb-1 text-2xl font-black text-amrs-preto">Materiais</h1>
        <p className="mb-8 text-sm font-light text-neutral-500">
          Catálogo, manual de marca, Projeto Digital, referências — pode enviar ou atualizar a
          qualquer momento, sem precisar refazer o briefing.
        </p>

        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
          <div className="mb-3 text-3xl">📎</div>
          <p className="mb-4 text-sm text-neutral-600">
            Sua pasta de materiais já está pronta. Envie os arquivos direto por lá.
          </p>
          <span className="inline-block rounded-full bg-amrs-preto px-6 py-3 text-sm font-bold text-white">
            Abrir pasta no Drive
          </span>
        </div>
      </main>
    </div>
  );
}
