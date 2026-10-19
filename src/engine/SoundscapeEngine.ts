import { ReenactmentMode } from '../types/history';

/**
 * 100% Procedural Web Audio API Historical Soundscape Synthesizer
 * Generates era-authentic ambient soundscapes (WWII air-raid sirens, aircraft radial drone,
 * Great Depression crackling barrel fires & cold wind, 1912 streetcar bell) with zero external audio files.
 */
class HistoricalSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isMuted = true;
  private currentMode: ReenactmentMode = 'depression_breadline';
  private activeNodes: AudioNode[] = [];
  private sirenTimer: number | null = null;

  public toggleAudio(mode: ReenactmentMode): boolean {
    this.currentMode = mode;
    if (this.isMuted) {
      this.start(mode);
      return true;
    } else {
      this.stop();
      return false;
    }
  }

  public updateMode(mode: ReenactmentMode) {
    this.currentMode = mode;
    if (!this.isMuted) {
      this.stop();
      this.start(mode);
    }
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }

  public start(mode: ReenactmentMode) {
    this.stop();
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = false;
    const ctx = this.ctx;

    // Create pink/brown noise buffer for atmospheric wind / fire crackle / urban rumble
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 0.18;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = mode.startsWith('depression') ? 320 : 240;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.16;

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
    whiteNoise.start();
    this.activeNodes.push(whiteNoise, filter, masterGain);

    // If WWII Blitz, add dual-tone wailing Air Raid Siren & low aircraft drone
    if (mode === 'wwii_blitz') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const sirenGain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      sirenGain.gain.value = 0.025;

      const sirenFilter = ctx.createBiquadFilter();
      sirenFilter.type = 'lowpass';
      sirenFilter.frequency.value = 620;

      osc1.connect(sirenFilter);
      osc2.connect(sirenFilter);
      sirenFilter.connect(sirenGain);
      sirenGain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      this.activeNodes.push(osc1, osc2, sirenFilter, sirenGain);

      let t = 0;
      this.sirenTimer = window.setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        t += 0.1;
        const lfo = Math.sin(t * 0.65);
        const baseFreq = 290 + (lfo + 1) * 75;
        osc1.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.08);
        osc2.frequency.setTargetAtTime(baseFreq * 1.189, this.ctx.currentTime, 0.08);
      }, 100);
    }
  }

  public triggerBellOrSirenPulse() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(this.currentMode === 'early_streetcar' ? 980 : 520, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  public stop() {
    this.isMuted = true;
    if (this.sirenTimer !== null) {
      clearInterval(this.sirenTimer);
      this.sirenTimer = null;
    }
    for (const node of this.activeNodes) {
      try {
        if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        }
        node.disconnect();
      } catch {
        // Ignore already stopped nodes
      }
    }
    this.activeNodes = [];
  }
}

export const soundscapeEngine = new HistoricalSoundscapeEngine();
