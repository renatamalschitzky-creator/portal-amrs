import { validarAcesso } from "@/lib/acesso";
import MensagemDeAcesso from "@/components/MensagemDeAcesso";

export default async function PaginaDeMateriais({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { slug } = await params;
  const { t } = await searchParams;

  const acesso = await validarAcesso(slug, t);
  if (!acesso.ok) return <MensagemDeAcesso motivo={acesso.motivo} />;

  const { pastaMateriais } = acesso.cliente;

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between bg-amrs-preto px-8 py-4 text-white">
        <a href={`/cliente/${slug}?t=${t}`} className="text-sm font-semibold text-neutral-300">
          ← Voltar ao calendário
        </a>
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
          {pastaMateriais ? (
            <>
              <p className="mb-4 text-sm text-neutral-600">
                Sua pasta de materiais já está pronta. Envie os arquivos direto por lá.
              </p>
              <a
                href={pastaMateriais}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-amrs-preto px-6 py-3 text-sm font-bold text-white"
              >
                Abrir pasta no Drive
              </a>
            </>
          ) : (
            <p className="text-sm text-neutral-600">
              Sua pasta de materiais ainda está sendo preparada. Assim que estiver pronta, o link
              aparece aqui.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
