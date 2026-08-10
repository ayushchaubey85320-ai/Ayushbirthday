/* ==========================================================================
   MAIN APPLICATION LOGIC & INTERACTION CONTROLLERS
   ========================================================================== */

import './style.css';
import confetti from 'canvas-confetti';
import { ParticleEngine } from './particles.js';
import { GymAudioEngine } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas Particle Engine
  const particleEngine = new ParticleEngine('bg-canvas');

  // 2. Initialize Audio Synthesizer
  const audioEngine = new GymAudioEngine();

  // 3. Unboxing Entrance Flow
  const unboxingScreen = document.getElementById('unboxing-screen');
  const mainApp = document.getElementById('main-app');
  const dumbbellBtn = document.getElementById('dumbbell-btn');
  const openGiftTrigger = document.getElementById('open-gift-trigger');

  const handleUnbox = () => {
    audioEngine.playPowerUpSound();
    
    // Confetti explosion
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      unboxingScreen.classList.add('fade-out');
      mainApp.classList.remove('hidden');
      audioEngine.toggleMusic(); // Start hype background music
      
      setTimeout(() => {
        unboxingScreen.classList.add('hidden');
      }, 800);
    }, 800);
  };

  if (dumbbellBtn) dumbbellBtn.addEventListener('click', handleUnbox);
  if (openGiftTrigger) openGiftTrigger.addEventListener('click', handleUnbox);

  // 4. Music Toggle Control
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const isPlaying = audioEngine.toggleMusic();
      audioToggleBtn.classList.toggle('playing', isPlaying);
    });
  }

  // 5. 3D Tilt Effect on Real Gym Photos
  const polaroids = document.querySelectorAll('.polaroid-card');
  polaroids.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (y / (rect.height / 2)) * -12;
      const rotateY = (x / (rect.width / 2)) * 12;

      const inner = card.querySelector('.polaroid-inner');
      if (inner) {
        inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.polaroid-inner');
      if (inner) {
        inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      }
    });

    // Lightbox modal trigger
    card.addEventListener('click', () => {
      const img = card.querySelector('.polaroid-img');
      const caption = card.querySelector('.polaroid-caption h3');
      const date = card.querySelector('.polaroid-date');

      if (img && caption) {
        document.getElementById('lightbox-img').src = img.src;
        document.getElementById('lightbox-title').textContent = caption.textContent;
        document.getElementById('lightbox-desc').textContent = date ? date.textContent : '';
        document.getElementById('lightbox-modal').classList.remove('hidden');
        audioEngine.playPowerUpSound();
      }
    });
  });

  // Lightbox Close
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');
  const lightboxModal = document.getElementById('lightbox-modal');
  if (closeLightboxBtn && lightboxModal) {
    closeLightboxBtn.addEventListener('click', () => lightboxModal.classList.add('hidden'));
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.add('hidden');
    });
  }

  // 6. "Why Ayush is the Ultimate Chad" 3D Flip Deck
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      audioEngine.playPowerUpSound();
    });
  });

  // 7. Interactive Protein Dumbbell Cake & Flame Blowout
  const flames = document.querySelectorAll('.flame');
  const blowBtn = document.getElementById('blow-candle-btn');
  const micBlowBtn = document.getElementById('mic-blow-btn');
  const wishStatus = document.getElementById('wish-status-msg');

  const extrapolateBlowOut = () => {
    flames.forEach(f => f.classList.add('extinguished'));
    wishStatus.innerHTML = "🎉 WISH GRANTED! DEMON BACK GAINS ACTIVATED! 🎉";
    wishStatus.style.color = "#ffd700";

    // Launch heavy confetti and sound chime
    audioEngine.playPowerUpSound();
    particleEngine.triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2);

    confetti({
      particleCount: 220,
      spread: 130,
      origin: { y: 0.5 }
    });
  };

  if (blowBtn) blowBtn.addEventListener('click', extrapolateBlowOut);

  // Microphone blow detection
  if (micBlowBtn) {
    micBlowBtn.addEventListener('click', async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        mediaStreamSource.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        wishStatus.textContent = "🎙️ Listening... Blow loudly into your microphone!";

        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;

          if (average > 45) { // Threshold for blow
            extrapolateBlowOut();
            stream.getTracks().forEach(track => track.stop());
          } else if (!flames[0].classList.contains('extinguished')) {
            requestAnimationFrame(checkVolume);
          }
        };
        checkVolume();
      } catch (err) {
        alert('Microphone access was denied or not supported. Use the blow button instead!');
      }
    });
  }

  // 8. Bro Birthday Scroll Letter
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const envelopeClosed = document.getElementById('envelope-closed');
  const letterOpen = document.getElementById('letter-open');
  const recloseLetterBtn = document.getElementById('reclose-letter-btn');

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', () => {
      audioEngine.playPowerUpSound();
      envelopeClosed.classList.add('hidden');
      letterOpen.classList.remove('hidden');
    });
  }

  if (recloseLetterBtn) {
    recloseLetterBtn.addEventListener('click', () => {
      letterOpen.classList.add('hidden');
      envelopeClosed.classList.remove('hidden');
    });
  }
});
