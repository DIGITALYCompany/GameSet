import { getSettings } from '@/lib/storage';

let ctx: AudioContext | null = null;

export function playHitSound(pitch = 880) {
  if (!getSettings().soundEffects) return;
  try {
    ctx ??= new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = pitch;
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // audio unavailable
  }
}
