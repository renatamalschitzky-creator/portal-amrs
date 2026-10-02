import { getCalendarioDoCliente, getBriefingDoCliente } from "@/lib/notion";
import { validarAcesso } from "@/lib/acesso";
import CalendarioGrid from "@/components/CalendarioGrid";
import MensagemDeAcesso from "@/components/MensagemDeAcesso";

export default async function PaginaDoCliente({
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
  const { cliente } = acesso;

  const [posts, briefing] = await Promise.all([
    getCalendarioDoCliente(cliente.id),
    getBriefingDoCliente(cliente.id),
  ]);

  const ciclo = posts[0]?.ciclo || "";
  const objetivoPrincipal =
    posts.reduce<Record<string, number>>((acc, p) => {
      if (p.objetivo) acc[p.objetivo] = (acc[p.objetivo] ?? 0) + 1;
      return acc;
    }, {});
  const objetivoDoMes = Object.entries(objetivoPrincipal).sort((a, b) => b[1] - a[1])[0]?.[0];

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
          <div className="mb-8 flex flex-col gap-2 rounded-2xl bg-amrs-vinho p-6 text-white">
            <div className="text-xs font-bold uppercase tracking-wide text-white/70">
              Configuração do mês
            </div>
            <div className="text-2xl font-black">{ciclo || "Ciclo atual"}</div>
            <div className="text-sm font-light text-white/80">
              Objetivo: <span className="font-semibold">{objetivoDoMes ?? "—"}</span>
            </div>
          </div>

          <h1 className="mb-4 text-xl font-black text-amrs-preto">
            Olá, {cliente.nome.split(" (")[0]} 👋
          </h1>

          <CalendarioGrid posts={posts} />
        </div>

        <aside className="w-64 shrink-0 space-y-4">
          <a
            href={`/cliente/${slug}/perfil?t=${t}`}
            className="block rounded-2xl border border-neutral-200 p-5 hover:border-amrs-laranja"
          >
            <div className="text-sm font-bold text-amrs-preto">Meu Perfil</div>
            <div className="text-xs text-neutral-500">
              {briefing?.status ?? "Preencher briefing"}
            </div>
          </a>
          <a
            href={`/cliente/${slug}/materiais?t=${t}`}
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
