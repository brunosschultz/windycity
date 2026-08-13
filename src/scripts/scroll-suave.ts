/* ============================================================
   Rolagem suave (Lenis) — DESKTOP APENAS.

   Por que não no mobile, e isso não é preferência estética:
   a inércia do Lenis continua emitindo posições novas depois que o dedo
   para. As cenas de vídeo raspado traduzem cada posição nova em um seek, e
   seek é justamente a operação que trava o Android — foi o problema que a
   gente acabou de resolver degradando para reprodução. Ligar inércia no
   celular multiplicaria os seeks e desfaria isso.

   Por que tudo é importado dinamicamente:
   neste projeto o GSAP NÃO está no carregamento inicial — são 110 KB em
   dois chunks que sete componentes buscam sob demanda. Importar `gsap` no
   topo deste arquivo o traria para o bundle de entrada de todo desktop.
   Módulos ES são singletons, então o ScrollTrigger que ligamos ao Lenis
   aqui é o mesmo que aqueles componentes usam depois — inclusive os que
   carregam bem mais tarde na página.
   ============================================================ */

type Lenis = {
  raf(tempo: number): void;
  on(evento: 'scroll', cb: () => void): void;
  scrollTo(alvo: Element | number, opcoes?: { offset?: number; immediate?: boolean }): void;
};

let instancia: Lenis | null = null;

/** Instância viva, ou null no mobile / movimento reduzido / antes de subir. */
export const rolagemSuave = (): Lenis | null => instancia;

/**
 * Rola até `alvo` respeitando o motor ativo. Existe porque `window.scrollTo`
 * move a posição nativa direto, e o Lenis — que mantém a própria posição
 * animada — a puxaria de volta no quadro seguinte. Todo scroll programático
 * da página deve passar por aqui.
 */
export function rolarAte(
  alvo: number | Element,
  opcoes: { offset?: number; imediato?: boolean } = {}
): void {
  const { offset = 0, imediato = false } = opcoes;
  if (instancia) {
    instancia.scrollTo(alvo, { offset, immediate: imediato });
    return;
  }
  const topo =
    typeof alvo === 'number' ? alvo : alvo.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: topo + offset, behavior: imediato ? 'auto' : 'smooth' });
}

/** Reposiciona sem animar — para correções de altura feitas por script. */
export function corrigirPosicao(delta: number): void {
  if (instancia) {
    instancia.scrollTo(window.scrollY + delta, { immediate: true });
    return;
  }
  window.scrollBy(0, delta);
}

const apto = window.matchMedia(
  '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
);

if (apto.matches) {
  void (async () => {
    const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    instancia = lenis as unknown as Lenis;
    document.documentElement.classList.add('lenis');

    /* As três linhas abaixo são o contrato com o GSAP. Sem elas o
       ScrollTrigger continua lendo a posição nativa enquanto a tela mostra a
       posição interpolada do Lenis, e toda animação por scroll dessincroniza
       do que se vê. */
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((tempo: number) => lenis.raf(tempo * 1000));
    gsap.ticker.lagSmoothing(0);

    /* Âncoras internas. O refresh ANTES do scroll é obrigatório: a página
       tem cenas com pin (as áreas comuns prendem por quatro telas), e sem
       recalcular os gatilhos o destino é medido na geometria de antes do
       pin — o erro chega a milhares de pixels. */
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (ev) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const alvo = document.querySelector(id);
        if (!alvo) return;
        ev.preventDefault();
        ScrollTrigger.refresh();
        lenis.scrollTo(alvo, { offset: -80 });
      });
    });

    /* Um pin no meio da página desloca o cálculo dos gatilhos criados ANTES
       dele. Ordenar e recalcular ao final do setup evita animações
       disparando fora de hora. Como os componentes sobem sob demanda, ainda
       recalculamos quando a página inteira termina de carregar. */
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    if (document.readyState !== 'complete') {
      addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }
  })();
}
