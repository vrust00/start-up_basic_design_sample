const wrapper = document.querySelector('.slider__wrapper');
const prevBtn = document.querySelector('.slider__btn.prev');
const nextBtn = document.querySelector('.slider__btn.next');

let isAnimating = false;

// Коэффициенты (доли от wrapper)
const C = {
  stepX: 0.33,        // ширина карточки + gap
  y: {
    slot0: 0,
    slot1: 0.05,
    slot2: -0.00,
    outLeft: 0.1,
    outRight: -0.1,
  },
};

// ====== Touch/Swipe поддержка ======
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const slider = document.querySelector('.slider');

slider.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

slider.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX < 0) moveRight();
    else moveLeft();
  }
}

// ====== Утилиты ======
function getSlides() {
  return Array.from(wrapper.children);
}

function getCenter() {
  return Math.trunc(getSlides().length / 2);
}

function toggleButtons(disable) {
  prevBtn.disabled = disable;
  nextBtn.disabled = disable;
}

function updateWrapperVars() {
  const w = wrapper.offsetWidth;
  const h = wrapper.offsetHeight;
  wrapper.style.setProperty('--wrapper-w', `${w}px`);
  wrapper.style.setProperty('--wrapper-h', `${h}px`);
}

function resetCard(card) {
  card.style.transition = 'none';
  card.style.transform = '';
  card.style.opacity = '';
}

let isMobile = window.innerWidth < 450;

// ====== Обновление видимости ======
function updateVisibility() {
  const slides = getSlides();
  const center = getCenter();
  isMobile = window.innerWidth < 450;

  slides.forEach((s, i) => {
    let shouldHide;
    if (isMobile) {
      shouldHide = i !== center;
    } else {
      shouldHide = i < center - 1 || i > center + 1;
    }
    s.classList.toggle('hide', shouldHide);

    if (i === center) {
      s.style.transition = 'none';
      s.style.transform = 'translateY(-5%)';
    }
  });
}

// ====== Движение вправо ======
function moveRight() {
  if (isAnimating) return;
  const slides = getSlides();
  if (slides.length < 4) return;

  isAnimating = true;
  toggleButtons(true);
  updateWrapperVars();

  const center = getCenter();
  const first = slides[center - 1];
  const second = slides[center];
  const third = slides[center + 1];
  const fourth = slides[center + 2];
  const cards = [first, second, third, fourth];

  const moveX = (coeff) => `calc(${coeff} * var(--wrapper-w))`;
  const moveY = (coeff) => `calc(${coeff} * var(--wrapper-h))`;

  // Сброс и начальные состояния
  cards.forEach(card => {
    resetCard(card);
    card.classList.remove('hide');
  });

  if (!isMobile) {
    // ---- Десктопный режим ----
    fourth.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.outLeft)})`;
    fourth.style.opacity = '0';
    second.style.transform = `translateX(0) translateY(${moveY(C.y.slot1 - 0.1)})`;
    void wrapper.offsetHeight;

    cards.forEach(card => {
      card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    });

    first.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.outLeft)})`;
    first.style.opacity = '0';

    second.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.slot0)})`;
    second.style.opacity = '1';

    third.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(-C.y.slot1)})`;
    third.style.opacity = '1';

    fourth.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.outRight + 0.1)})`;
    fourth.style.opacity = '1';

    first.addEventListener('transitionend', function handler() {
      first.removeEventListener('transitionend', handler);
      cards.forEach(resetCard);
      wrapper.appendChild(first);
      updateVisibility();
      isAnimating = false;
      toggleButtons(false);
    });
  } else {
    // ---- Мобильный режим ----
    fourth.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.outLeft)})`;
    fourth.style.opacity = '0';
    second.style.transform = `translateX(0) translateY(${moveY(C.y.slot1 - 0.1)})`;
    first.style.opacity = '0';
    third.style.opacity = '0';
    void wrapper.offsetHeight;

    cards.forEach(card => {
      card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    });

    first.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.outLeft)})`;
    first.style.opacity = '0';

    second.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.slot0)})`;
    second.style.opacity = '0';

    third.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(-C.y.slot1)})`;
    third.style.opacity = '1';

    fourth.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.outRight + 0.1)})`;
    fourth.style.opacity = '0';

    third.addEventListener('transitionend', function handler() {
      third.removeEventListener('transitionend', handler);
      cards.forEach(resetCard);
      wrapper.appendChild(third);
      updateVisibility();
      isAnimating = false;
      toggleButtons(false);
    });
  }
}

// ====== Движение влево (аналогично moveRight, но зеркально) ======
function moveLeft() {
  if (isAnimating) return;
  const slides = getSlides();
  if (slides.length < 4) return;

  isAnimating = true;
  toggleButtons(true);
  updateWrapperVars();

  const center = getCenter();
  const first = slides[center - 1];
  const second = slides[center];
  const third = slides[center + 1];
  const last = slides[slides.length - 1];
  const cards = [first, second, third, last];

  const moveX = (coeff) => `calc(${coeff} * var(--wrapper-w))`;
  const moveY = (coeff) => `calc(${coeff} * var(--wrapper-h))`;

  // Сброс
  cards.forEach(card => {
    resetCard(card);
    card.classList.remove('hide');
  });

  if (!isMobile) {
    // ---- Десктопный режим (зеркально moveRight) ----
    last.style.transform = `translateX(${moveX(-C.stepX*4)}) translateY(${moveY(C.y.outLeft)})`;
    last.style.opacity = '0';
    second.style.transform = `translateX(0) translateY(${moveY(C.y.slot1 - 0.1)})`;
    void wrapper.offsetHeight;

    cards.forEach(card => {
      card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    });

    first.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.slot1 - 0.1)})`;
    first.style.opacity = '1';

    second.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.slot2)})`;
    second.style.opacity = '1';

    third.style.transform = `translateX(${moveX(C.stepX*1)}) translateY(${moveY(C.y.outLeft)})`;
    third.style.opacity = '0';

    last.style.transform = `translateX(${moveX(-C.stepX*3)}) translateY(${moveY(C.y.slot0)})`;
    last.style.opacity = '1';

    last.addEventListener('transitionend', function handler() {
      last.removeEventListener('transitionend', handler);
      cards.forEach(resetCard);
      wrapper.appendChild(third);
      wrapper.insertBefore(last, first);
      updateVisibility();
      isAnimating = false;
      toggleButtons(false);
    });
  } else {
    // ---- Мобильный режим (зеркально moveRight) ----
    last.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.outLeft)})`;
    last.style.opacity = '0';
    second.style.transform = `translateX(0) translateY(${moveY(C.y.slot1 - 0.1)})`;
    first.style.opacity = '0';
    third.style.opacity = '0';
    void wrapper.offsetHeight;

    cards.forEach(card => {
      card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    });

    first.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.slot1 - 0.1)})`;
    first.style.opacity = '1';

    second.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.slot2)})`;
    second.style.opacity = '0';

    third.style.transform = `translateX(${moveX(C.stepX*1)}) translateY(${moveY(C.y.outLeft)})`;
    third.style.opacity = '0';

    last.style.transform = `translateX(${moveX(-C.stepX*3)}) translateY(${moveY(C.y.slot0)})`;
    last.style.opacity = '0';

    first.addEventListener('transitionend', function handler() {
      first.removeEventListener('transitionend', handler);
      cards.forEach(resetCard);
      wrapper.appendChild(first);
      updateVisibility();
      isAnimating = false;
      toggleButtons(false);
    });
  }
}

// ====== Инициализация ======
updateWrapperVars();
updateVisibility();

nextBtn.addEventListener('click', moveRight);
prevBtn.addEventListener('click', moveLeft);

// ====== Ресайз ======
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateWrapperVars();
    const slides = getSlides();
    slides.forEach(card => {
      card.style.transition = 'none';
      card.style.transform = '';
      card.style.opacity = '';
    });
    updateVisibility();
  }, 200);
});