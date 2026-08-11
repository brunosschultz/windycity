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

/* ------------------------------------------------------------
   Raspagem de vídeo pelo scroll (scrubbing).

   Duas cenas fazem isso — a hero e a de proximidades — e as duas tinham
   o mesmo defeito, escrito duas vezes: mover o `currentTime` a cada frame
   do rAF, sem esperar o seek anterior terminar. Quem paga é o Android:
   o MediaCodec descarta o pedido em voo e esvazia o decodificador toda vez,
   de onde vêm o engasgo e o quadro que "passa sem aparecer". O AVFoundation
   do iOS é rápido o bastante para mascarar, e foi por isso que o problema
   só apareceu num lado.

   Aqui a regra é uma só: UM seek por vez, guardando apenas o último alvo
   pendente. O vídeo anda no ritmo que o aparelho aguenta em vez de acumular
   fila.
   ------------------------------------------------------------ */

export type Raspador = {
  /** Pede a posição `t` (segundos). Serializa sozinho. */
  irPara(t: number): void;
  /** Mediana dos últimos seeks medidos, em ms. 0 = ainda sem amostra. */
  mediana(): number;
  amostras(): number;
  nome: string;
  /** Quantas vezes o vídeo está sendo AMPLIADO na tela deste aparelho.
      Acima de ~2x já se vê moleza — e nenhum bitrate corrige ampliação. */
  ampliacao(): number;
  video: HTMLVideoElement;
};

/** Todos os raspadores vivos, para o painel de ?debug=video ler. */
export const raspadores: Raspador[] = [];

export function criarRaspador(
  video: HTMLVideoElement,
  nome: string,
  opcoes: { limiteMs?: number; aoDegradar?: () => void } = {}
): Raspador {
  const limite = opcoes.limiteMs ?? 40;
  const MIN_AMOSTRAS = 8;

  let buscando = false;
  let pendente: number | null = null;
  let iniciou = 0;
  let medivel = false;
  let degradou = false;
  let med = 0;
  const amostras: number[] = [];

  /* Só entra na média o seek que caiu em trecho JÁ bufferizado. Seek em
     trecho não baixado demora por rede, não por decodificação — sem esta
     guarda, um aparelho ótimo em conexão ruim seria rebaixado por um
     problema que não é dele. */
  const bufferizado = (t: number) => {
    const b = video.buffered;
    for (let i = 0; i < b.length; i++) {
      if (t >= b.start(i) && t <= b.end(i)) return true;
    }
    return false;
  };

  const irPara = (t: number) => {
    if (degradou) return;
    if (buscando) {
      pendente = t;
      return;
    }
    buscando = true;
    medivel = bufferizado(t);
    iniciou = performance.now();
    video.currentTime = t;
  };

  video.addEventListener('seeked', () => {
    buscando = false;
    if (iniciou && medivel && !degradou) {
      amostras.push(performance.now() - iniciou);
      if (amostras.length > 10) amostras.shift();
      if (amostras.length >= MIN_AMOSTRAS) {
        const ord = [...amostras].sort((a, b) => a - b);
        med = ord[Math.floor(ord.length / 2)];
        if (med > limite && opcoes.aoDegradar) {
          degradou = true;
          pendente = null;
          opcoes.aoDegradar();
          return;
        }
      }
    }
    if (pendente === null) return;
    const t = pendente;
    pendente = null;
    irPara(t);
  });
  // se o seek falhar, não trava a raspagem para sempre
  video.addEventListener('error', () => {
    buscando = false;
  });

  const r: Raspador = {
    irPara,
    mediana: () => med,
    amostras: () => amostras.length,
    nome,
    video,
    /* object-fit:cover escala pelo MAIOR fator — é esse que define a nitidez
       percebida, não a razão de largura. */
    ampliacao: () => {
      const c = video.getBoundingClientRect();
      if (!video.videoWidth || !c.width) return 0;
      const dpr = devicePixelRatio || 1;
      return Math.max((c.width * dpr) / video.videoWidth, (c.height * dpr) / video.videoHeight);
    },
  };
  raspadores.push(r);
  return r;
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
