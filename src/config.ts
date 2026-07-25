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
  endereco: '[Endereço da obra — a confirmar]',
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

export const EMPREENDIMENTO = {
  unidades: 48,
  walkScore: 92,
  comercializado: '~50%',
  entrada: 10,
  obra: 20,
  chaves: 70,
} as const;
