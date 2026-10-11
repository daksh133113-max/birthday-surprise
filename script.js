document.addEventListener("DOMContentLoaded", () => {
  const screens = [
    document.getElementById("page-intro"),
    document.getElementById("page-candle"),
    document.getElementById("page-music"),
    document.getElementById("page-photos"),
    document.getElementById("page-letter")
  ];
  const progressSteps = [...document.querySelectorAll(".progress-step")];
  const beginBtn = document.getElementById("beginBtn");
  const blowBtn = document.getElementById("blowBtn");
  const candleNextBtn = document.getElementById("candleNextBtn");
  const candleStatus = document.getElementById("candleStatus");
  const candle = document.querySelector(".candle");
  const music = document.getElementById("birthdaySong");
  const musicToggle = document.getElementById("musicToggle");
  const musicStatus = document.getElementById("musicStatus");
  const soundWave = document.getElementById("soundWave");
  const photoGrid = document.getElementById("photoGrid");
  let currentPage = 0;

  function goToPage(index) {
    currentPage = Math.max(0, Math.min(Number(index) || 0, screens.length - 1));
    screens.forEach((screen, i) => {
      screen.classList.toggle("active", i === currentPage);
      screen.setAttribute("aria-hidden", i === currentPage ? "false" : "true");
    });
    progressSteps.forEach((step, i) => {
      step.classList.toggle("active", i === currentPage);
      step.classList.toggle("done", i < currentPage);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Start looping music when the music page is reached.
    if (currentPage === 2) attemptMusic();
  }

  // Expose navigation so the HTML buttons can still invoke it directly.
  window.showBirthdayPage = goToPage;


  blowBtn.addEventListener("click", () => {
    candle.classList.add("blown");
    candleStatus.textContent = "Wish sent to the universe! ✨ May it come true.";
    blowBtn.hidden = true;
    candleNextBtn.hidden = false;
    burstHearts(18);
  });

  document.getElementById("restartBtn").addEventListener("click", () => {
    candle.classList.remove("blown");
    candleStatus.textContent = "Your candle is waiting for your wish 🕯️";
    blowBtn.hidden = false;
    candleNextBtn.hidden = true;
    goToPage(0);
  });

  async function attemptMusic() {
    try {
      await music.play();
      setMusicPlaying(true);
    } catch (error) {
      // Autoplay with sound may be blocked by the browser; the visible play button remains.
      setMusicPlaying(false);
      musicStatus.textContent = "Tap play to start your song";
    }
  }

  function setMusicPlaying(playing) {
    musicToggle.textContent = playing ? "Ⅱ" : "▶";
    musicToggle.setAttribute("aria-label", playing ? "Pause birthday song" : "Play birthday song");
    musicStatus.textContent = playing ? "Now playing · looping for you" : "Ready to play your song";
    soundWave.classList.toggle("playing", playing);
  }

  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      await attemptMusic();
    } else {
      music.pause();
      setMusicPlaying(false);
    }
  });
  music.addEventListener("play", () => setMusicPlaying(true));
  music.addEventListener("pause", () => setMusicPlaying(false));
  music.addEventListener("error", () => {
    musicStatus.textContent = "Add birthday-song.mp3 to this folder";
    setMusicPlaying(false);
  });

  // Bundled photos appear automatically. Tap a photo to open the slideshow.
  const memoryPhotos = [...document.querySelectorAll(".memory-photo")];
  const lightbox = document.getElementById("photoLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  let activePhoto = 0;

  function showMemory(index) {
    if (!memoryPhotos.length) return;
    activePhoto = (index + memoryPhotos.length) % memoryPhotos.length;
    lightboxImage.src = memoryPhotos[activePhoto].dataset.photo;
    lightboxImage.alt = `Birthday memory ${activePhoto + 1}`;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }
  function closeMemory() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  }
  memoryPhotos.forEach((photo, index) => photo.addEventListener("click", () => showMemory(index)));
  document.getElementById("lightboxClose").addEventListener("click", closeMemory);
  document.getElementById("lightboxPrev").addEventListener("click", () => showMemory(activePhoto - 1));
  document.getElementById("lightboxNext").addEventListener("click", () => showMemory(activePhoto + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeMemory();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") closeMemory();
    if (event.key === "ArrowLeft") showMemory(activePhoto - 1);
    if (event.key === "ArrowRight") showMemory(activePhoto + 1);
  });

  // Background floating hearts and sparkles.
  const heartLayer = document.querySelector(".ambient-hearts");
  const sparkleLayer = document.querySelector(".sparkle-layer");
  const heartChars = ["♡", "♥", "💕", "✧"];
  function addFloatingHeart() {
    const heart = document.createElement("span");
    heart.className = "float-heart";
    heart.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${13 + Math.random() * 20}px`;
    heart.style.animationDuration = `${7 + Math.random() * 7}s`;
    heartLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 15000);
  }
  setInterval(addFloatingHeart, 700);
  for (let i = 0; i < 8; i++) setTimeout(addFloatingHeart, i * 250);

  for (let i = 0; i < 30; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.textContent = "✦";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.fontSize = `${7 + Math.random() * 11}px`;
    sparkle.style.animationDuration = `${1.4 + Math.random() * 3}s`;
    sparkle.style.animationDelay = `${Math.random() * 2}s`;
    sparkleLayer.appendChild(sparkle);
  }

  function burstHearts(count) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");
      heart.className = "float-heart";
      heart.textContent = ["💗", "✨", "♡", "💕"][Math.floor(Math.random() * 4)];
      heart.style.left = `${25 + Math.random() * 50}%`;
      heart.style.bottom = `${15 + Math.random() * 25}%`;
      heart.style.fontSize = `${16 + Math.random() * 18}px`;
      heart.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      heartLayer.appendChild(heart);
      setTimeout(() => heart.remove(), 5000);
    }
  }
});
