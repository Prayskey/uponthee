document.addEventListener('DOMContentLoaded', function () {

  const AUTOPLAY_DELAY = 5000;
  const TOTAL_SLIDES   = 3;

  const counterEl  = document.getElementById('slide-counter');
  const progressEl = document.getElementById('autoplay-progress-fill');

  // ── Progress bar animation ─────────────────────────────
  let progressTimer   = null;
  let progressStart   = null;
  let progressRunning = false;

  function startProgress() {
    stopProgress();
    progressRunning = true;
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progressEl.style.transition = `width ${AUTOPLAY_DELAY}ms linear`;
        progressEl.style.width = '100%';
      });
    });

    progressTimer = setTimeout(stopProgress, AUTOPLAY_DELAY);
  }

  function stopProgress() {
    progressRunning = false;
    clearTimeout(progressTimer);
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';
  }

  // ── Slide counter ──────────────────────────────────────
  function updateCounter(realIndex) {
    const current = (realIndex % TOTAL_SLIDES) + 1;
    counterEl.textContent = `${current} / ${TOTAL_SLIDES}`;
  }

  // ── Swiper init ────────────────────────────────────────
  const swiper = new Swiper('#main-carousel', {
    loop         : true,
    loopedSlides : TOTAL_SLIDES,
    slidesPerView: 1,
    speed        : 700,

    autoplay: {
      delay               : AUTOPLAY_DELAY,
      disableOnInteraction: false,
      pauseOnMouseEnter   : true,
    },

    pagination: {
      el       : '.swiper-pagination',
      clickable: true,
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween : 0,
        loopedSlides : TOTAL_SLIDES,
      },
      768: {
        slidesPerView : 1.15,
        centeredSlides: true,
        spaceBetween  : 20,
        loopedSlides  : TOTAL_SLIDES,
      },
      1024: {
        slidesPerView : 1.25,
        centeredSlides: true,
        spaceBetween  : 28,
        loopedSlides  : TOTAL_SLIDES,
      },
    },

    on: {
      init(sw) {
        updateCounter(sw.realIndex);
        startProgress();
      },

      slideChangeTransitionStart(sw) {
        updateCounter(sw.realIndex);
        startProgress();
      },

      autoplayPause() {
        stopProgress();
      },

      autoplayResume() {
        startProgress();
      },
    },
  });

  // ── Pause autoplay + progress on hover ────────────────
  const section = document.querySelector('.carousel-section');

  section.addEventListener('mouseenter', () => {
    swiper.autoplay.pause();
    stopProgress();
  });

  section.addEventListener('mouseleave', () => {
    swiper.autoplay.resume();
    startProgress();
  });

  // ── Pause on page visibility change ───────────────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      swiper.autoplay.pause();
      stopProgress();
    } else {
      swiper.autoplay.resume();
      startProgress();
    }
  });

});
