import { getCalendarioDoCliente, getBriefingDoCliente } from "@/lib/notion";
import { validarAcesso } from "@/lib/acesso";
import CalendarioGrid from "@/components/CalendarioGrid";
import MensagemDeAcesso from "@/components/MensagemDeAcesso";
import ConfiguracaoDoMes from "@/components/ConfiguracaoDoMes";

export default async function PaginaDoCliente({
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
  const { cliente } = acesso;

  const [posts, briefing] = await Promise.all([
    getCalendarioDoCliente(cliente.id),
    getBriefingDoCliente(cliente.id),
  ]);

  const ciclo = posts[0]?.ciclo || "";

  return (
    <div className="min-h-screen bg-white">
      {/* topo */}
      <header className="flex items-center justify-between bg-amrs-preto px-8 py-4 text-white">
        <div className="text-lg font-black tracking-wide">
          AMRS<span className="text-amrs-laranja">.</span>
        </div>
        <div className="text-sm font-light text-neutral-300">Clube de Assinatura</div>
        <div className="rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-semibold text-emerald-400">
          {cliente.status}
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl gap-10 px-8 py-10">
        <div className="flex-1">
          <ConfiguracaoDoMes
            slug={slug}
            token={t!}
            ciclo={ciclo}
            objetivoAtual={cliente.objetivoDoMes}
            diasAtuais={cliente.diasDePostagem}
            postsPorSemanaAtual={cliente.postsPorSemana}
            temaAtual={cliente.temaDoMes}
          />

          <h1 className="mb-4 text-xl font-black text-amrs-preto">
            Olá, {cliente.nome.split(" (")[0]} 👋
          </h1>

          <CalendarioGrid posts={posts} />
        </div>

        <aside className="w-64 shrink-0 space-y-4">
          <a
            href={`/cliente/${slug}/perfil?token=${t}`}
            className="block rounded-2xl border border-neutral-200 p-5 hover:border-amrs-laranja"
          >
            <div className="text-sm font-bold text-amrs-preto">Meu Perfil</div>
            <div className="text-xs text-neutral-500">
              {briefing?.status ?? "Preencher briefing"}
            </div>
          </a>
          <a
            href={`/cliente/${slug}/materiais?token=${t}`}
            className="block rounded-2xl border border-neutral-200 p-5 hover:border-amrs-laranja"
          >
            <div className="text-sm font-bold text-amrs-preto">Materiais</div>
            <div className="text-xs text-neutral-500">Enviar arquivos</div>
          </a>
        </aside>
      </main>
    </div>
  );
}
