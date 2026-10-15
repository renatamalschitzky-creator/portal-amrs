export const metadata = { title: "Política de Privacidade | Portal AMRS" };

export default function PoliticaDePrivacidade() {
  return (
    <main className="mx-auto max-w-2xl px-8 py-12 text-neutral-800">
      <h1 className="mb-6 text-3xl font-black text-amrs-preto">Política de Privacidade</h1>
      <p className="mb-4 text-sm text-neutral-500">Portal de Assinatura AMRS, da AMRS Digital.</p>

      <h2 className="mb-2 mt-8 text-lg font-bold">Quais dados usamos</h2>
      <p className="mb-4">
        O Portal AMRS guarda as informações que você nos passa para planejar o seu conteúdo: dados
        de contato, respostas do briefing, configurações do mês e os materiais que você envia
        (logotipos, fotos, catálogos e documentos).
      </p>

      <h2 className="mb-2 mt-8 text-lg font-bold">Para que usamos</h2>
      <p className="mb-4">
        Usamos esses dados somente para produzir e entregar o seu calendário de conteúdo e prestar o
        serviço contratado. Não vendemos nem compartilhamos suas informações com terceiros para
        fins de publicidade.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-bold">Onde ficam guardados</h2>
      <p className="mb-4">
        Os dados do cadastro ficam em nosso espaço no Notion. Os arquivos que você envia pelo portal
        são salvos numa pasta do Google Drive da AMRS reservada ao seu cadastro. O portal usa o
        acesso ao Google Drive exclusivamente para gravar os arquivos enviados por você nessa pasta.
      </p>

      <h2 className="mb-2 mt-8 text-lg font-bold">Seus direitos</h2>
      <p className="mb-4">
        Você pode pedir a qualquer momento acesso, correção ou exclusão dos seus dados e arquivos,
        escrevendo para clube@aminharedesocial.com.br.
      </p>

      <p className="mt-10 text-sm text-neutral-500">Última atualização: outubro de 2026.</p>
    </main>
  );
}
