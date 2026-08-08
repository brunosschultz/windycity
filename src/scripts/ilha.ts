/* ============================================================
   Utilidades mínimas compartilhadas pelas ilhas de animação.

   Convenção do projeto: cada seção que precisa de GSAP importa a lib
   DINAMICAMENTE dentro de `aoAproximar`, para o peso só ser baixado
   quando a seção se aproxima da viewport:

     import { aoAproximar, reduzMovimento } from '../scripts/ilha';
     aoAproximar(secao, async () => {
       if (reduzMovimento()) return; // conteúdo já visível por padrão
       const [{ gsap }, { ScrollTrigger }] = await Promise.all([
         import('gsap'),
         import('gsap/ScrollTrigger'),
       ]);
       gsap.registerPlugin(ScrollTrigger);
       // ...
     });

   REGRA DE OURO: nenhum conteúdo pode nascer escondido via CSS estático
   à espera do JS. Estado inicial oculto só via gsap.set()/JS — assim,
   sem JS (ou com movimento reduzido) tudo aparece normalmente.
   ============================================================ */

export const reduzMovimento = (): boolean =>
  matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Executa `iniciar` uma única vez, quando o elemento se aproxima da viewport. */
export function aoAproximar(el: Element, iniciar: () => void, margem = '600px'): void {
  if (!('IntersectionObserver' in window)) {
    iniciar();
    return;
  }
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) {
          io.disconnect();
          iniciar();
          return;
        }
      }
    },
    { rootMargin: `${margem} 0px` }
  );
  io.observe(el);
}

/* ------------------------------------------------------------
   Splitters locais (leves). O SplitText do GSAP existe no pacote,
   mas para palavra/letra simples estes bastam e pesam ~0.
   Só devem ser chamados DENTRO da inicialização JS — o texto
   original permanece intacto sem JS.
   ------------------------------------------------------------ */

/** Envolve cada palavra em <span class="palavra"><span>…</span></span> e
 *  devolve os spans internos (alvos de animação). */
export function dividirPalavras(el: HTMLElement): HTMLElement[] {
  const texto = el.textContent ?? '';
  el.textContent = '';
  const alvos: HTMLElement[] = [];
  for (const parte of texto.split(/(\s+)/)) {
    if (!parte) continue;
    if (/^\s+$/.test(parte)) {
      el.append(document.createTextNode(' '));
      continue;
    }
    const externo = document.createElement('span');
    externo.className = 'palavra';
    externo.style.display = 'inline-block';
    externo.style.overflow = 'hidden';
    externo.style.verticalAlign = 'top';
    const interno = document.createElement('span');
    interno.style.display = 'inline-block';
    interno.textContent = parte;
    externo.append(interno);
    el.append(externo);
    alvos.push(interno);
  }
  return alvos;
}

/** Envolve cada letra em <span> (para títulos curtos) e devolve os spans. */
export function dividirLetras(el: HTMLElement): HTMLElement[] {
  const texto = el.textContent ?? '';
  el.textContent = '';
  const alvos: HTMLElement[] = [];
  for (const ch of [...texto]) {
    if (ch === ' ') {
      el.append(document.createTextNode(' '));
      continue;
    }
    const externo = document.createElement('span');
    externo.style.display = 'inline-block';
    externo.style.overflow = 'hidden';
    externo.style.verticalAlign = 'top';
    const interno = document.createElement('span');
    interno.style.display = 'inline-block';
    interno.textContent = ch;
    externo.append(interno);
    el.append(externo);
    alvos.push(interno);
  }
  return alvos;
}
