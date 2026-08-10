/* ==========================================================================
   ANIME POWER SYNTHESIZER & GYM SOUND EFFECTS ENGINE
   ========================================================================== */

export class GymAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.intervalId = null;
    this.noteStep = 0;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  toggleMusic() {
    this.initContext();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.isPlaying;
  }

  startMusic() {
    this.isPlaying = true;
    this.noteStep = 0;

    // High energy anime synth chords (frequencies in Hz)
    const powerMelody = [
      329.63, 440.00, 523.25, 659.25, // E4, A4, C5, E5
      293.66, 392.00, 493.88, 587.33, // D4, G4, B4, D5
      349.23, 440.00, 523.25, 698.46, // F4, A4, C5, F5
      392.00, 523.25, 659.25, 783.99  // G4, C5, E5, G5
    ];

    this.intervalId = setInterval(() => {
      if (!this.isPlaying) return;
      const freq = powerMelody[this.noteStep % powerMelody.length];
      this.playTone(freq, 0.8, 'sawtooth');
      this.noteStep++;
    }, 400);
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  playTone(freq, duration, type = 'sine') {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playPowerUpSound() {
    this.initContext();
    const notes = [220.00, 329.63, 440.00, 659.25, 880.00];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.6, 'square');
      }, idx * 70);
    });
  }

  playUnboxSound() {
    this.initContext();
    const notes = [349.23, 440.00, 523.25, 698.46];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.5, 'triangle');
      }, idx * 80);
    });
  }
}
