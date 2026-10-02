import { montarGradeDoCiclo, corDoFormato } from "@/lib/calendario";
import type { PostCalendario } from "@/lib/notion";

const DIAS_SEMANA = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];

export default function CalendarioGrid({ posts }: { posts: PostCalendario[] }) {
  const semanas = montarGradeDoCiclo(posts);

  if (semanas.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
        Seu calendário deste ciclo ainda está sendo gerado.
      </div>
    );
  }

  return (
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
                <div
                  key={p.id}
                  className={`truncate rounded-md px-2 py-1 text-[11px] font-semibold ${corDoFormato(
                    p.formato
                  )}`}
                  title={`${p.formato ?? ""} — ${p.editoria ?? ""}`}
                >
                  {p.formato ?? "Post"}
                </div>
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
  );
}
