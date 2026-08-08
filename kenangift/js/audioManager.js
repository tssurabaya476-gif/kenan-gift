/* ==========================================================================
   LITTLE MIRACLE — Audio Manager Engine (Enhanced Multi-Layer Orchestral Lullaby)
   Combines HTML5 Audio BGM & Rich Web Audio Polyphonic Lullaby Synthesizer
   (Warm Ambient Pads, Glockenspiel Chimes, Harp Arpeggios & Gentle Bass)
   ========================================================================== */

export class AudioManager {
  constructor(audioSrc, initialVolume = 0.6) {
    this.audioSrc = audioSrc;
    this.initialVolume = initialVolume;
    this.isPlaying = false;
    this.audioContext = null;
    this.synthInterval = null;
    this.userRequestedPlay = false;

    this.audio = new Audio(audioSrc);
    this.audio.loop = true;
    this.audio.volume = initialVolume;
    this.audioHasError = false;

    this.audio.onerror = () => {
      console.warn('HTML5 Audio error encountered, flagging for synth fallback.');
      this.audioHasError = true;
    };

    this.initUserGestureUnlock();
  }

  initUserGestureUnlock() {
    const unlock = () => {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      if (!this.isPlaying && this.userRequestedPlay) {
        this.play();
      }
    };
    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  play() {
    this.userRequestedPlay = true;
    this.ensureAudioContext();

    if (this.audioHasError) {
      this.startRichLullabySynth();
      this.isPlaying = true;
      this.updateBtnUI();
      return;
    }

    const playPromise = this.audio.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
        this.stopRichLullabySynth();
        this.updateBtnUI();
      }).catch(err => {
        console.warn('HTML5 Audio play prevented or failed, activating Web Audio Multi-Layer Synth:', err);
        this.audioHasError = true;
        this.startRichLullabySynth();
        this.isPlaying = true;
        this.updateBtnUI();
      });
    } else {
      this.stopRichLullabySynth();
      this.isPlaying = true;
      this.updateBtnUI();
    }
  }

  pause() {
    this.userRequestedPlay = false;
    this.audio.pause();
    this.stopRichLullabySynth();
    this.isPlaying = false;
    this.updateBtnUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  updateBtnUI() {
    const audioBtn = document.getElementById('audio-toggle');
    if (audioBtn) {
      if (this.isPlaying) {
        audioBtn.classList.add('playing');
        audioBtn.setAttribute('aria-label', 'Matikan Musik');
        audioBtn.innerHTML = '🎵';
      } else {
        audioBtn.classList.remove('playing');
        audioBtn.setAttribute('aria-label', 'Putar Musik');
        audioBtn.innerHTML = '🔇';
      }
    }
  }

  ensureAudioContext() {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  /* --------------------------------------------------------------------------
     RICH MULTI-LAYER LULLABY SYNTHESIZER
     Layers:
     1. Warm Ambient Triangle Pad Chords (Cmaj7 - Am7 - Fmaj7 - G7sus4)
     2. Sparkling Music Box / Glockenspiel Melody Chimes (Pentatonic Lullaby)
     3. Soft Acoustic Harp Arpeggios
     4. Sub-Bass Warmth
     -------------------------------------------------------------------------- */
  startRichLullabySynth() {
    if (this.synthInterval) return;
    this.ensureAudioContext();
    if (!this.audioContext) return;

    // Harmonic Chord Progressions (Frequencies in Hz)
    const chords = [
      { bass: 130.81, pad: [261.63, 329.63, 392.00, 493.88], arpeggio: [523.25, 659.25, 783.99, 987.77] }, // Cmaj7
      { bass: 110.00, pad: [220.00, 261.63, 329.63, 392.00], arpeggio: [440.00, 523.25, 659.25, 783.99] }, // Am7
      { bass: 87.31,  pad: [174.61, 220.00, 261.63, 329.63], arpeggio: [349.23, 440.00, 523.25, 659.25] }, // Fmaj7
      { bass: 98.00,  pad: [196.00, 246.94, 293.66, 349.23], arpeggio: [392.00, 493.88, 587.33, 698.46] }  // G7sus4
    ];

    // Sweet Lullaby Glockenspiel Notes (High Bell Frequencies)
    const glockenspielMelody = [
      1046.50, 1046.50, 1567.98, 1567.98, 1760.00, 1760.00, 1567.98,
      1396.91, 1396.91, 1318.51, 1318.51, 1174.66, 1174.66, 1046.50,
      1567.98, 1567.98, 1396.91, 1396.91, 1318.51, 1318.51, 1174.66,
      1567.98, 1567.98, 1396.91, 1396.91, 1318.51, 1318.51, 1174.66
    ];

    let step = 0;

    this.synthInterval = setInterval(() => {
      if (!this.isPlaying || !this.audioContext) return;
      const ctx = this.audioContext;
      const now = ctx.currentTime;

      const currentChord = chords[Math.floor(step / 4) % chords.length];
      const melodyFreq = glockenspielMelody[step % glockenspielMelody.length];
      const arpFreq = currentChord.arpeggio[step % currentChord.arpeggio.length];

      // --- Layer 1: Glockenspiel / Music Box Chime ---
      const bellOsc = ctx.createOscillator();
      const bellHarmonic = ctx.createOscillator();
      const bellGain = ctx.createGain();

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(melodyFreq, now);

      bellHarmonic.type = 'sine';
      bellHarmonic.frequency.setValueAtTime(melodyFreq * 2.75, now);

      bellGain.gain.setValueAtTime(0.12 * this.initialVolume, now);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      bellOsc.connect(bellGain);
      bellHarmonic.connect(bellGain);
      bellGain.connect(ctx.destination);

      bellOsc.start(now);
      bellHarmonic.start(now);
      bellOsc.stop(now + 1.8);
      bellHarmonic.stop(now + 1.8);

      // --- Layer 2: Soft Harp Arpeggio ---
      const harpOsc = ctx.createOscillator();
      const harpGain = ctx.createGain();

      harpOsc.type = 'triangle';
      harpOsc.frequency.setValueAtTime(arpFreq, now + 0.15);

      harpGain.gain.setValueAtTime(0.08 * this.initialVolume, now + 0.15);
      harpGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      harpOsc.connect(harpGain);
      harpGain.connect(ctx.destination);

      harpOsc.start(now + 0.15);
      harpOsc.stop(now + 1.2);

      // --- Layer 3: Warm Ambient Pad & Bass (Played at start of each 4-step bar) ---
      if (step % 4 === 0) {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        const padMasterGain = ctx.createGain();
        padMasterGain.gain.setValueAtTime(0.001, now);
        padMasterGain.gain.linearRampToValueAtTime(0.06 * this.initialVolume, now + 0.8);
        padMasterGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

        currentChord.pad.forEach(freq => {
          const padOsc = ctx.createOscillator();
          padOsc.type = 'sine';
          padOsc.frequency.setValueAtTime(freq, now);
          padOsc.connect(filter);
          padOsc.start(now);
          padOsc.stop(now + 3.8);
        });

        const bassOsc = ctx.createOscillator();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(currentChord.bass, now);
        bassOsc.connect(filter);
        bassOsc.start(now);
        bassOsc.stop(now + 3.8);

        filter.connect(padMasterGain);
        padMasterGain.connect(ctx.destination);
      }

      step++;
    }, 900);
  }

  stopRichLullabySynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}
