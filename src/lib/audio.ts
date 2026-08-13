let audioCtx: AudioContext | null = null;

let audioBuffer: AudioBuffer | null = null;
let bufferLoading: Promise<AudioBuffer | null> | null = null;

let notifBuffer: AudioBuffer | null = null;
let notifBufferLoading: Promise<AudioBuffer | null> | null = null;

function getAudioContext(): AudioContext | null {
  if (audioCtx) return audioCtx;

  const AudioContextClass =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  audioCtx = new AudioContextClass();
  return audioCtx;
}

async function loadBuffer(ctx: AudioContext, path: string): Promise<AudioBuffer | null> {
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  return ctx.decodeAudioData(arrayBuffer);
}

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
      bufferLoading = loadBuffer(ctx, '/audio/timer.mp3')
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
  }
}

export function playNotification(): void {
  if (typeof window === 'undefined') return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (notifBuffer) {
      const source = ctx.createBufferSource();
      source.buffer = notifBuffer;
      source.connect(ctx.destination);
      source.start(0);
      return;
    }

    if (!notifBufferLoading) {
      notifBufferLoading = loadBuffer(ctx, '/audio/notification.mp3')
        .then((buffer) => {
          notifBuffer = buffer;
          return buffer;
        })
        .catch(() => {
          notifBufferLoading = null;
          return null;
        });
    }

    notifBufferLoading.then((buffer) => {
      if (!buffer) return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    });
  } catch {
  }
}
