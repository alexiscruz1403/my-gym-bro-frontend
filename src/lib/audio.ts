let audioCtx: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let bufferLoading: Promise<AudioBuffer | null> | null = null;

function getAudioContext(): AudioContext | null {
  if (audioCtx) return audioCtx;

  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  audioCtx = new AudioContextClass();
  return audioCtx;
}

async function loadBuffer(ctx: AudioContext): Promise<AudioBuffer | null> {
  const response = await fetch('/audio/timer.mp3');
  const arrayBuffer = await response.arrayBuffer();
  return ctx.decodeAudioData(arrayBuffer);
}

/**
 * Plays the timer notification sound (/audio/timer.mp3) using the Web Audio API.
 * Uses AudioBufferSourceNode for reliable playback in timer callbacks,
 * including mobile browsers with strict autoplay policies.
 * Silently no-ops in environments where AudioContext is unavailable.
 */
export function playBeep(
  _frequency?: number,
  _durationMs?: number,
  _volume?: number,
): void {
  if (typeof window === 'undefined') return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (audioBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start(0);
      return;
    }

    if (!bufferLoading) {
      bufferLoading = loadBuffer(ctx)
        .then((buffer) => {
          audioBuffer = buffer;
          return buffer;
        })
        .catch(() => {
          bufferLoading = null;
          return null;
        });
    }

    bufferLoading.then((buffer) => {
      if (!buffer) return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    });
  } catch {
    // Audio not available — fail silently
  }
}
