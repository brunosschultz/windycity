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
  /** Somente dígitos, formato internacional. Confirmado pelo cliente. */
  whatsapp: '554199635801' as string | null,
  whatsappDisplay: '41 99963-5801',
  instagram: '@girassolincorporacoes',
  instagramUrl: 'https://instagram.com/girassolincorporacoes',
  email: '[contato@girassolincorporacoes.com.br]',
  /** CNPJ da Girassol Incorporações — confirmado pelo cliente. */
  cnpj: '38.634.976/0001-99',
  endereco: 'Rua Conselheiro Dantas, 1287 — Rebouças',
} as const;

/**
 * Enquanto não houver número de WhatsApp confirmado, todo CTA leva ao
 * formulário da própria página em vez de a um link quebrado.
 */
/**
 * Mensagem única de abertura, aprovada pelo cliente. TODOS os CTAs levam ao
 * mesmo link com este texto — não há variação por seção.
 */
export const MENSAGEM_WA =
  'Olá, Gostaria de mais informações sobre o empreendimento WindyCity da Girassol Incorporadora.';

/**
 * Link de todos os CTAs. O parâmetro existe para quem quiser um texto
 * diferente, mas o padrão é a mensagem aprovada — passar nada é o caminho
 * certo na página inteira.
 */
export const waHref = (mensagem: string = MENSAGEM_WA): string => {
  if (!CONTATO.whatsapp) return '#contato';
  return `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(mensagem)}`;
};

/**
 * Vídeo institucional no YouTube — só o ID, não a URL: o player é montado a
 * partir dele no clique. `null` volta o bloco a ser capa estática.
 */
export const VIDEO_INSTITUCIONAL = 'v7rtZDklGQo' as string | null;

export const EMPREENDIMENTO = {
  unidades: 48,
  walkScore: 92,
  comercializado: '50%',
  /** Anos de experiência combinada da equipe técnica — informado pelo cliente. */
  anosEquipe: 20,
  /** Faixa de valores das unidades — informada pelo cliente. */
  precoMin: 'R$ 279 mil',
  precoMax: 'R$ 370 mil',
  entrada: 10,
  obra: 20,
  chaves: 70,
} as const;
