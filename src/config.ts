/**
 * Fonte única de verdade para dados de negócio ainda não confirmados.
 * Tudo que está como `null` ou entre colchetes veio assim do wireframe aprovado —
 * não foi inventado. Ao receber o dado real, altere APENAS aqui.
 */

export const SITE = {
  // TODO: trocar pelo domínio real antes do deploy (usado em canonical, OG e sitemap)
  url: 'https://windycity.com.br',
  nome: 'WindyCity',
  incorporadora: 'Girassol Incorporações',
  cidade: 'Curitiba',
  estado: 'PR',
  title: 'WindyCity · Studios e Gardens em Curitiba | Girassol Incorporações',
  description:
    'Studios e Gardens em Curitiba com luz natural em todos os cômodos, ventilação natural em todos os ambientes e Walk Score 92. Um empreendimento Girassol Incorporações.',
} as const;

export const CONTATO = {
  /** Somente dígitos, formato internacional (ex.: '5541999999999'). `null` = ainda não informado. */
  whatsapp: null as string | null,
  whatsappDisplay: '(XX) XXXXX-XXXX',
  instagram: '@girassolincorporacoes',
  instagramUrl: 'https://instagram.com/girassolincorporacoes',
  email: '[contato@girassolincorporacoes.com.br]',
  cnpj: '[00.000.000/0000-00]',
  endereco: 'Rua Conselheiro Dantas, 1287 — Prado Velho',
} as const;

/**
 * Enquanto não houver número de WhatsApp confirmado, todo CTA leva ao
 * formulário da própria página em vez de a um link quebrado.
 */
export const waHref = (mensagem?: string): string => {
  if (!CONTATO.whatsapp) return '#contato';
  const texto = mensagem ? `?text=${encodeURIComponent(mensagem)}` : '';
  return `https://wa.me/${CONTATO.whatsapp}${texto}`;
};

/**
 * Vídeo institucional (fundadores apresentando a Girassol e o WindyCity).
 * `null` = arquivo ainda não entregue — o bloco fica como capa estática e o
 * play não promete o que não existe. Ao receber o vídeo: colocar em
 * `public/video/` e apontar o caminho aqui. Nada mais precisa mudar.
 */
export const VIDEO_INSTITUCIONAL = null as string | null;

export const EMPREENDIMENTO = {
  unidades: 48,
  walkScore: 92,
  comercializado: '50%',
  /** Anos de experiência combinada da equipe técnica — informado pelo cliente. */
  anosEquipe: 10,
  /** Faixa de valores das unidades — informada pelo cliente. */
  precoMin: 'R$ 279 mil',
  precoMax: 'R$ 370 mil',
  entrada: 10,
  obra: 20,
  chaves: 70,
} as const;
