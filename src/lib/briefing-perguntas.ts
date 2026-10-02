export type Pergunta = { id: string; texto: string; ajuda?: string };
export type Bloco = { id: string; titulo: string; perguntas: Pergunta[] };

export const BLOCOS: Bloco[] = [
  {
    id: "bloco1",
    titulo: "Bloco 01 — Questionário geral",
    perguntas: [
      {
        id: "q1",
        texto: "Em quais redes sociais você está presente?",
        ajuda: "Instagram / Facebook / TikTok / LinkedIn / YouTube / Outros",
      },
      { id: "q2", texto: "Você tem possibilidade de produzir material profissional (fotos/vídeos)?" },
      {
        id: "q3",
        texto: "Você já tem identidade visual definida (cores, fontes)?",
        ajuda: "Se sim, envie no campo de Materiais de apoio",
      },
      { id: "q4", texto: "Qual seu objetivo principal nas redes?" },
      {
        id: "q5",
        texto: "Como é o organograma da sua empresa?",
        ajuda: "Exemplifique bem — qual a função de cada pessoa, principalmente se elas também vão aparecer no perfil",
      },
      { id: "q6", texto: "Como funciona sua jornada de compra / processo de vendas?" },
      { id: "q7", texto: "Como é a sua rotina de trabalho?" },
      {
        id: "q8",
        texto: "Quais são exatamente os produtos/serviços que você oferece?",
        ajuda: "Explique bem detalhadamente",
      },
      { id: "q9", texto: "Quais perfis te inspiram (referências de conteúdo, formato, design)?" },
      { id: "q10", texto: "Quais perfis você não gosta / não quer se parecer?" },
      { id: "q11", texto: "Quais pessoas te inspiram (podem ser de qualquer área)?" },
    ],
  },
  {
    id: "bloco2",
    titulo: "Bloco 02 — Sobre seu público",
    perguntas: [
      { id: "q12", texto: "Quem é seu público atual?" },
      {
        id: "q13",
        texto: "Descreva seu seguidor/cliente ideal, com o máximo de detalhes possível",
        ajuda: "O que ele gosta, o que não gosta, rotina, comportamento — quanto mais detalhado, melhor",
      },
    ],
  },
  {
    id: "bloco3",
    titulo: "Bloco 03 — Sobre seu negócio",
    perguntas: [
      { id: "q14", texto: "Qual problema você resolve?" },
      { id: "q15", texto: "Qual a transformação que você causa na vida do cliente?" },
      { id: "q16", texto: "Por que as pessoas buscam o seu produto/serviço?" },
      { id: "q17", texto: "Qual a maior dor do seu cliente?" },
      { id: "q18", texto: "Qual sua situação atual e onde quer estar em 5 anos?" },
      { id: "q19", texto: "Qual o seu maior diferencial?" },
    ],
  },
  {
    id: "bloco4",
    titulo: "Bloco 04 — Sobre você",
    perguntas: [
      { id: "q20", texto: "Quem é você / quem é o dono da empresa? Conte sua história" },
      { id: "q21", texto: "Que estilo musical te inspira / combina com sua marca?" },
      { id: "q22", texto: "Quais são suas referências de inspiração?" },
    ],
  },
  {
    id: "bloco5",
    titulo: "Bloco 05 — Sobre suas redes sociais",
    perguntas: [
      { id: "q23", texto: "Qual sua maior dificuldade nas redes sociais?" },
      { id: "q24", texto: "O que você já fez de mais interessante? Do que você se orgulha?" },
      { id: "q25", texto: "Quais assuntos você gosta de abordar?" },
      { id: "q26", texto: "Como estão suas redes hoje?" },
    ],
  },
  {
    id: "tomdevoz",
    titulo: "Tom de Voz — matéria-prima da sua fala",
    perguntas: [
      {
        id: "q27",
        texto: "Qual o link do seu Instagram?",
        ajuda: "A IA tenta consultar como apoio, mas nem sempre consegue acessar tudo",
      },
      { id: "q28", texto: "Cole aqui de 3 a 5 legendas ou falas de Reels que você sinta que representam bem como você fala" },
    ],
  },
];

export const TOTAL_PERGUNTAS = BLOCOS.reduce((acc, b) => acc + b.perguntas.length, 0);
