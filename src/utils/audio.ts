// Advanced programmatic synthesized audio engine for retro-modern physical feedback sounds
// Fully client-side, zero assets requested, custom envelope controls

let isAudioMuted = false;

export function setAudioMuted(muted: boolean) {
  isAudioMuted = muted;
}

export function getAudioMuted(): boolean {
  return isAudioMuted;
}

// Low-level wave synthesizer
function playSineWave(freq: number, duration: number, volume: number = 0.1, rampType: 'expo' | 'linear' = 'linear') {
  if (isAudioMuted) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    if (rampType === 'expo') {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    } else {
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    }

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Graceful catch for audio policy restrictions prior to user gesture
    console.debug("Synthesized feedback sound blocked by browser focus policy:", e);
  }
}

// Real-world physical tactile key switch click
export function playPhysicalClick() {
  // Ultra-short, dual-transient impulse wave mimicking a heavy plastic mechanical key-cap
  playSineWave(1200, 0.015, 0.08, 'expo');
  setTimeout(() => {
    playSineWave(600, 0.02, 0.04, 'expo');
  }, 5);
}

// Smooth digital tab activation chime
export function playTabActivation() {
  playSineWave(440, 0.08, 0.12, 'linear');
  setTimeout(() => {
    playSineWave(554.37, 0.12, 0.08, 'linear');
  }, 60);
}

// Success chime on completing a cycle
export function playAssessmentComplete() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
  notes.forEach((freq, idx) => {
    setTimeout(() => {
      playSineWave(freq, 0.3, 0.06, 'expo');
    }, idx * 100);
  });
}

// WARNING warning alarm
export function playDiagnosticAlert() {
  playSineWave(293.66, 0.15, 0.1, 'linear'); // D4
  setTimeout(() => {
    playSineWave(293.66, 0.15, 0.1, 'linear');
  }, 180);
}

// Hospital machine radar sweep hum
export function playRadarSweep() {
  playSineWave(880, 0.4, 0.02, 'expo');
}
