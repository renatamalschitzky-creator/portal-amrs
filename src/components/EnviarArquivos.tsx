"use client";

import { useRef, useState } from "react";

type Item = {
  nome: string;
  estado: "enviando" | "ok" | "erro";
  progresso: number;
  mensagem?: string;
};

function enviarParaOGoogle(
  url: string,
  arquivo: File,
  aoProgredir: (percentual: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) aoProgredir(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(String(xhr.status))));
    xhr.onerror = () => reject(new Error("rede"));
    xhr.send(arquivo);
  });
}

export default function EnviarArquivos({ slug, token }: { slug: string; token: string }) {
  const [itens, setItens] = useState<Item[]>([]);
  const entrada = useRef<HTMLInputElement>(null);

  function atualizar(indice: number, mudanca: Partial<Item>) {
    setItens((atual) => atual.map((item, i) => (i === indice ? { ...item, ...mudanca } : item)));
  }

  async function enviar(arquivos: FileList | null) {
    if (!arquivos || arquivos.length === 0) return;
    const lista = Array.from(arquivos);
    const base = itens.length;
    setItens((atual) => [
      ...atual,
      ...lista.map((a) => ({ nome: a.name, estado: "enviando" as const, progresso: 0 })),
    ]);

    for (let i = 0; i < lista.length; i++) {
      const arquivo = lista[i];
      const indice = base + i;
      try {
        const pedido = await fetch("/api/materiais/iniciar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            token,
            nome: arquivo.name,
            tipo: arquivo.type,
            tamanho: arquivo.size,
          }),
        });
        const dados = await pedido.json();
        if (!pedido.ok) throw new Error(dados.error ?? "falha");
        await enviarParaOGoogle(dados.urlDeEnvio, arquivo, (p) => atualizar(indice, { progresso: p }));
        atualizar(indice, { estado: "ok", progresso: 100 });
      } catch (erro) {
        const motivo = erro instanceof Error ? erro.message : "falha";
        atualizar(indice, {
          estado: "erro",
          mensagem: motivo.includes("500 MB") ? "Arquivo maior que 500 MB." : "Não foi possível enviar. Tente de novo.",
        });
      }
    }
    if (entrada.current) entrada.current.value = "";
  }

  return (
    <div>
      <input
        ref={entrada}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => enviar(e.target.files)}
      />
      <button
        type="button"
        onClick={() => entrada.current?.click()}
        className="inline-block rounded-full bg-amrs-laranja px-6 py-3 text-sm font-bold text-white"
      >
        Enviar arquivo
      </button>

      {itens.length > 0 && (
        <ul className="mt-6 space-y-3 text-left">
          {itens.map((item, i) => (
            <li key={i} className="rounded-xl border border-neutral-200 bg-white p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate font-semibold text-neutral-800">{item.nome}</span>
                <span className="shrink-0 text-xs text-neutral-500">
                  {item.estado === "ok" ? "Enviado ✓" : item.estado === "erro" ? "Erro" : `${item.progresso}%`}
                </span>
              </div>
              {item.estado === "enviando" && (
                <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-200">
                  <div className="h-1.5 rounded-full bg-amrs-laranja" style={{ width: `${item.progresso}%` }} />
                </div>
              )}
              {item.estado === "erro" && <p className="mt-1 text-xs text-red-600">{item.mensagem}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
