export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-amrs-preto px-6 text-white">
      <div className="max-w-md text-center">
        <div className="mb-4 text-2xl font-black">
          AMRS<span className="text-amrs-laranja">.</span>
        </div>
        <h1 className="mb-2 text-lg font-bold">Portal de Assinatura</h1>
        <p className="text-sm font-light text-neutral-300">
          Essa área é de acesso individual, por link enviado a cada cliente — não
          existe login geral aqui.
        </p>
      </div>
    </div>
  );
}
