const TEXTOS = {
  "sem-token": {
    titulo: "Link incompleto",
    texto: "Esse link está sem o código de acesso. Confira se copiou a URL inteira.",
  },
  invalido: {
    titulo: "Link inválido",
    texto:
      "Não encontramos um portal com esse link. Se você acabou de assinar, confira seu e-mail novamente ou fale com a gente.",
  },
  bloqueado: {
    titulo: "Acesso indisponível",
    texto:
      "Seu acesso ao portal está temporariamente suspenso. Isso costuma acontecer por conta do pagamento — qualquer dúvida, fale com a gente.",
  },
} as const;

export default function MensagemDeAcesso({
  motivo,
}: {
  motivo: keyof typeof TEXTOS;
}) {
  const { titulo, texto } = TEXTOS[motivo];
  return (
    <div className="flex min-h-screen items-center justify-center bg-amrs-preto px-6">
      <div className="max-w-md text-center text-white">
        <div className="mb-4 text-lg font-black">
          AMRS<span className="text-amrs-laranja">.</span>
        </div>
        <h1 className="mb-2 text-xl font-bold">{titulo}</h1>
        <p className="text-sm font-light text-neutral-300">{texto}</p>
      </div>
    </div>
  );
}
