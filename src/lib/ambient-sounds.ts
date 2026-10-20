// Sons ambiente gerados com Web Audio API (sem arquivos de áudio)

export type SoundId = "rain" | "thunder" | "fire" | "waves" | "wind";

export interface AmbientSound {
  setVolume: (volume: number) => void;
  stop: () => void;
}

type NoiseColor = "white" | "pink" | "brown";

let context: AudioContext | null = null;
const bufferCache = new Map<NoiseColor, AudioBuffer>();

const getContext = () => {
  if (!context) context = new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
};

/** Buffer de ruído com as bordas emendadas para o loop não estalar. */
const getNoiseBuffer = (ctx: AudioContext, color: NoiseColor) => {
  const cached = bufferCache.get(color);
  if (cached) return cached;

  const length = ctx.sampleRate * 8;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (color === "white") {
      data[i] = white;
    } else if (color === "pink") {
      // Filtro de Paul Kellet
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    } else {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
  }

  // Crossfade do fim com o início; o loop recomeça logo após a região de fade
  const fade = Math.floor(ctx.sampleRate * 0.5);
  for (let i = 0; i < fade; i++) {
    const t = i / fade;
    data[length - fade + i] = data[length - fade + i] * (1 - t) + data[i] * t;
  }

  bufferCache.set(color, buffer);
  return buffer;
};

const startNoise = (ctx: AudioContext, color: NoiseColor) => {
  const source = ctx.createBufferSource();
  source.buffer = getNoiseBuffer(ctx, color);
  source.loop = true;
  source.loopStart = 0.5;
  source.loopEnd = source.buffer.duration;
  source.start(0, Math.random() * 6);
  return source;
};

const filter = (ctx: AudioContext, type: BiquadFilterType, frequency: number, q = 0.7) => {
  const node = ctx.createBiquadFilter();
  node.type = type;
  node.frequency.value = frequency;
  node.Q.value = q;
  return node;
};

const gainNode = (ctx: AudioContext, value: number) => {
  const node = ctx.createGain();
  node.gain.value = value;
  return node;
};

/** Oscilador lento que modula um parâmetro (ondas, rajadas de vento). */
const lfo = (ctx: AudioContext, frequency: number, depth: number, target: AudioParam) => {
  const osc = ctx.createOscillator();
  osc.frequency.value = frequency;
  const depthGain = gainNode(ctx, depth);
  osc.connect(depthGain).connect(target);
  osc.start();
  return osc;
};

/** Rajada curta de ruído (gota de chuva, estalo de lenha). */
const burst = (
  ctx: AudioContext,
  output: AudioNode,
  { duration, frequency, q, volume }: { duration: number; frequency: number; q: number; volume: number },
) => {
  const source = ctx.createBufferSource();
  source.buffer = getNoiseBuffer(ctx, "white");
  const band = filter(ctx, "bandpass", frequency, q);
  const env = gainNode(ctx, 0);
  const now = ctx.currentTime;
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(volume, now + 0.002);
  env.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(band).connect(env).connect(output);
  source.start(now, Math.random() * 7);
  source.stop(now + duration + 0.05);
};

/** Agenda eventos em intervalos aleatórios até ser cancelado. */
const randomLoop = (minMs: number, maxMs: number, fn: () => void, firstDelayMs = minMs) => {
  let timer: number;
  const tick = () => {
    fn();
    timer = window.setTimeout(tick, minMs + Math.random() * (maxMs - minMs));
  };
  timer = window.setTimeout(tick, firstDelayMs);
  return () => window.clearTimeout(timer);
};

type Builder = (ctx: AudioContext, out: GainNode) => {
  sources: AudioScheduledSourceNode[];
  cancel?: () => void;
};

const builders: Record<SoundId, Builder> = {
  rain: (ctx, out) => {
    // Intensidade varia devagar, como chuva de verdade
    const intensity = gainNode(ctx, 0.85);
    intensity.connect(out);
    const swell = lfo(ctx, 0.07, 0.12, intensity.gain);

    // Camada principal: chiado largo e macio
    const wash = startNoise(ctx, "pink");
    wash.connect(filter(ctx, "highpass", 250)).connect(filter(ctx, "lowpass", 2800)).connect(gainNode(ctx, 0.9)).connect(intensity);

    // Corpo grave da chuva caindo no chão
    const body = startNoise(ctx, "brown");
    body.connect(filter(ctx, "lowpass", 500)).connect(gainNode(ctx, 0.35)).connect(intensity);

    // Textura fina e aguda bem baixinha
    const sizzle = startNoise(ctx, "white");
    sizzle.connect(filter(ctx, "highpass", 6000)).connect(gainNode(ctx, 0.025)).connect(intensity);

    // Respingos próximos, raros e sem tom definido
    const cancel = randomLoop(120, 600, () =>
      burst(ctx, intensity, {
        duration: 0.01 + Math.random() * 0.02,
        frequency: 2500 + Math.random() * 3000,
        q: 0.8,
        volume: 0.02 + Math.random() * 0.05,
      }),
    );
    return { sources: [wash, body, sizzle, swell], cancel };
  },

  thunder: (ctx, out) => {
    const clap = () => {
      const now = ctx.currentTime;
      const distance = Math.random(); // 0 = perto, 1 = longe
      const length = 4 + Math.random() * 5;

      const source = ctx.createBufferSource();
      source.buffer = getNoiseBuffer(ctx, "brown");
      source.start(now, Math.random() * 2);
      source.stop(now + length + 1);

      // Trovão perto começa mais "aberto" e vai abafando
      const lowpass = filter(ctx, "lowpass", 900 - distance * 600);
      lowpass.frequency.setTargetAtTime(110, now + 0.2, 1.2);

      const env = gainNode(ctx, 0);
      const peak = 1.6 - distance * 0.9;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(peak, now + 0.05 + distance * 0.5);
      // Ronco com algumas "ondas" antes de sumir
      env.gain.setTargetAtTime(peak * 0.5, now + 0.6, 0.4);
      env.gain.setTargetAtTime(peak * 0.7, now + 1.5 + Math.random(), 0.3);
      env.gain.setTargetAtTime(0, now + 2.5 + Math.random(), length / 4);

      source.connect(lowpass).connect(env).connect(out);
    };

    // Primeiro trovão logo, para dar retorno ao ligar; depois a cada 15–45 s
    const cancel = randomLoop(15000, 45000, clap, 1500);
    return { sources: [], cancel };
  },

  fire: (ctx, out) => {
    const roar = startNoise(ctx, "brown");
    const roarGain = gainNode(ctx, 0.9);
    roar.connect(filter(ctx, "lowpass", 450)).connect(roarGain).connect(out);
    const flicker = lfo(ctx, 0.3, 0.25, roarGain.gain);

    const hiss = startNoise(ctx, "white");
    hiss.connect(filter(ctx, "highpass", 3000)).connect(gainNode(ctx, 0.02)).connect(out);

    const cancel = randomLoop(40, 450, () => {
      const pops = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < pops; i++) {
        window.setTimeout(
          () =>
            burst(ctx, out, {
              duration: 0.004 + Math.random() * 0.02,
              frequency: 800 + Math.random() * 3000,
              q: 1.5,
              volume: 0.2 + Math.random() * 0.8,
            }),
          i * (10 + Math.random() * 40),
        );
      }
    });
    return { sources: [roar, hiss, flicker], cancel };
  },

  waves: (ctx, out) => {
    const swell = gainNode(ctx, 0.5);
    swell.connect(out);
    const swellLfo = lfo(ctx, 0.09, 0.45, swell.gain);

    const body = startNoise(ctx, "brown");
    body.connect(filter(ctx, "lowpass", 900)).connect(swell);

    const foam = startNoise(ctx, "pink");
    foam.connect(filter(ctx, "highpass", 1500)).connect(gainNode(ctx, 0.25)).connect(swell);

    return { sources: [body, foam, swellLfo] };
  },

  wind: (ctx, out) => {
    const band = filter(ctx, "bandpass", 500, 0.9);
    const gusts = gainNode(ctx, 0.8);
    const noise = startNoise(ctx, "pink");
    noise.connect(band).connect(gusts).connect(out);

    const pitchLfo = lfo(ctx, 0.05, 250, band.frequency);
    const gustLfo = lfo(ctx, 0.13, 0.35, gusts.gain);
    return { sources: [noise, pitchLfo, gustLfo] };
  },
};

const FADE = 0.4;

export const startAmbientSound = (id: SoundId, volume: number): AmbientSound => {
  const ctx = getContext();
  const out = gainNode(ctx, 0);
  out.connect(ctx.destination);
  out.gain.setTargetAtTime(volume, ctx.currentTime, FADE / 3);

  const { sources, cancel } = builders[id](ctx, out);

  return {
    setVolume: (v) => out.gain.setTargetAtTime(v, ctx.currentTime, 0.05),
    stop: () => {
      cancel?.();
      out.gain.setTargetAtTime(0, ctx.currentTime, FADE / 3);
      window.setTimeout(() => {
        sources.forEach((s) => s.stop());
        out.disconnect();
      }, FADE * 1000 + 100);
    },
  };
};
