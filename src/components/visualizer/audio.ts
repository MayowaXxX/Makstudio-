/**
 * Web Audio analyser wrapper. Produces per-frame band energies, a kick pulse
 * and a 256-band log-scaled spectrum history (HIST_ROWS frames) for the
 * visualizer shaders. When nothing is playing it synthesizes a gentle idle
 * signal so the piece still breathes.
 */
export const BANDS = 256;
export const HIST_ROWS = 48;

export type AudioFrame = {
  bass: number;
  mid: number;
  high: number;
  energy: number;
  kick: number;
  /** BANDS × HIST_ROWS bytes, row 0 = newest. */
  history: Uint8Array;
};

export class AudioAnalyser {
  readonly el: HTMLAudioElement;
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private freq: Uint8Array<ArrayBuffer> = new Uint8Array(1024);
  private map: Uint16Array = new Uint16Array(BANDS);
  private frame: AudioFrame = { bass: 0, mid: 0, high: 0, energy: 0, kick: 0, history: new Uint8Array(BANDS * HIST_ROWS) };
  private bassAvg = 0.2;
  private lastKick = 0;

  constructor(el: HTMLAudioElement) {
    this.el = el;
  }

  /** Must be called from a user gesture (play click). */
  async ensureContext() {
    if (!this.ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor();
      const src = this.ctx.createMediaElementSource(this.el);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.78;
      src.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      this.freq = new Uint8Array(this.analyser.frequencyBinCount);
      // Log-spaced mapping from 256 visual bands to FFT bins (~20Hz → ~15kHz)
      const maxBin = Math.min(this.analyser.frequencyBinCount - 1, 700);
      for (let i = 0; i < BANDS; i++) this.map[i] = Math.max(1, Math.round(Math.pow(maxBin, i / (BANDS - 1))));
    }
    if (this.ctx.state === "suspended") await this.ctx.resume();
  }

  get active() {
    return !!this.analyser && !this.el.paused;
  }

  sample(time: number): AudioFrame {
    const f = this.frame;
    const hist = f.history;
    // shift history down one row
    hist.copyWithin(BANDS, 0, BANDS * (HIST_ROWS - 1));

    let bass = 0,
      mid = 0,
      high = 0;
    if (this.active && this.analyser) {
      this.analyser.getByteFrequencyData(this.freq);
      for (let i = 0; i < BANDS; i++) {
        const b = this.map[i];
        // average a small neighborhood for smoother high bands
        const v = (this.freq[b] + this.freq[Math.min(b + 1, this.freq.length - 1)]) >> 1;
        hist[i] = v;
      }
      bass = avg(this.freq, 1, 7);
      mid = avg(this.freq, 8, 93);
      high = avg(this.freq, 94, 400);
    } else {
      // Idle: slow-moving hills so the form keeps breathing
      for (let i = 0; i < BANDS; i++) {
        const x = i / BANDS;
        const v = 0.22 + 0.18 * Math.sin(x * 9 - time * 1.3) * Math.sin(x * 3 + time * 0.7) + 0.08 * Math.sin(time * 2.1 + x * 20);
        hist[i] = Math.max(0, Math.min(255, v * 255 * (1 - x * 0.7)));
      }
      bass = 0.16 + 0.07 * Math.sin(time * 1.6);
      mid = 0.12 + 0.04 * Math.sin(time * 0.9 + 1);
      high = 0.06 + 0.03 * Math.sin(time * 2.3 + 2);
    }

    // envelopes: fast attack, slower release
    f.bass = env(f.bass, bass, 0.5, 0.12);
    f.mid = env(f.mid, mid, 0.4, 0.1);
    f.high = env(f.high, high, 0.5, 0.15);
    f.energy = f.bass * 0.5 + f.mid * 0.35 + f.high * 0.15;

    // kick detection relative to a running bass average
    this.bassAvg += (bass - this.bassAvg) * 0.04;
    if (this.active && bass > this.bassAvg * 1.25 && bass > 0.45 && time - this.lastKick > 0.18) {
      f.kick = 1;
      this.lastKick = time;
    } else {
      f.kick *= 0.9;
    }
    return f;
  }

  dispose() {
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.analyser = null;
  }
}

function avg(arr: Uint8Array, from: number, to: number) {
  let s = 0;
  for (let i = from; i <= to; i++) s += arr[i];
  return s / ((to - from + 1) * 255);
}

function env(prev: number, next: number, attack: number, release: number) {
  return prev + (next - prev) * (next > prev ? attack : release);
}
