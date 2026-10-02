import { validarAcesso } from "@/lib/acesso";
import { getBriefingDoCliente } from "@/lib/notion";
import MensagemDeAcesso from "@/components/MensagemDeAcesso";
import BriefingForm from "@/components/BriefingForm";
import BriefingStatusOuForm from "@/components/BriefingStatusOuForm";

export default async function PaginaDePerfil({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token: t } = await searchParams;

  const acesso = await validarAcesso(slug, t);
  if (!acesso.ok) return <MensagemDeAcesso motivo={acesso.motivo} />;

  const briefing = await getBriefingDoCliente(acesso.cliente.id);

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between bg-amrs-preto px-8 py-4 text-white">
        <a href={`/cliente/${slug}?token=${t}`} className="text-sm font-semibold text-neutral-300">
          ← Voltar ao calendário
        </a>
        <div className="text-lg font-black tracking-wide">
          AMRS<span className="text-amrs-laranja">.</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-10">
        <h1 className="mb-1 text-2xl font-black text-amrs-preto">Meu Perfil</h1>
        <p className="mb-8 text-sm font-light text-neutral-500">
          Responda com calma — quanto mais completo, melhor fica o resultado final.
        </p>

        {briefing?.status === "Completo" ? (
          <BriefingStatusOuForm slug={slug} token={t!} nivel={briefing.nivelPreenchimento} />
        ) : (
          <BriefingForm slug={slug} token={t!} respostasIniciais={briefing?.respostas} />
        )}
      </main>
    </div>
  );
}
