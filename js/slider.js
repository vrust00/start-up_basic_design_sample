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

const slider = document.querySelector('.slider'); // или wrapper

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
  
  // Проверяем, что свайп горизонтальный (X > Y)
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Минимальное расстояние для свайпа (50px)
    if (Math.abs(diffX) > 50) {
      if (diffX < 0) {
        // Свайп влево → moveRight
        moveRight();
      } else {
        // Свайп вправо → moveLeft
        moveLeft();
      }
    }
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

// Обновляем CSS-переменные на wrapper
function updateWrapperVars() {
  const w = wrapper.offsetWidth;
  const h = wrapper.offsetHeight;
  wrapper.style.setProperty('--wrapper-w', `${w}px`);
  wrapper.style.setProperty('--wrapper-h', `${h}px`);
}

// Сброс инлайн-стилей слайда
function resetCard(card) {
  card.style.transition = 'none';
  card.style.transform = '';
  card.style.opacity = '';
}

// Управление классом hide
function updateVisibility() {
  const slides = getSlides();
  const center = getCenter();
  slides.forEach((s, i) => {
    const shouldHide = i < center - 1 || i > center + 1;
    s.classList.toggle('hide', shouldHide);
   if (i === center) {
      s.style.transition = 'none';  // без анимации
      s.style.transform = 'translateY(-5%)';  // приподнять на 5% от своей высоты
    }

   
  });
}

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

  // Функции перемещения (объявляем ДО использования)
  const moveX = (coeff) => `calc(${coeff} * var(--wrapper-w))`;
  const moveY = (coeff) => `calc(${coeff} * var(--wrapper-h))`;

  // 1. Мгновенный сброс + показать fourth
  [first, second, third, fourth].forEach(card => {
    resetCard(card);
    card.style.transition = 'none';
    card.classList.remove('hide');
  });
  
  // fourth — начальная позиция под третьей
  fourth.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.outLeft)})`;
  fourth.style.opacity = '0';
second.style.transform = `translateX(0) translateY(${moveY(C.y.slot1 - 0.1)})`;
  void wrapper.offsetHeight; 

  // 2. Включаем transition
  [first, second, third, fourth].forEach(card => {
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  });

  // 3. Конечные позиции
   first.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.outLeft)})`;
  first.style.opacity = '0';

  second.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.slot0)})`;

  third.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(-C.y.slot1)})`;

  fourth.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.outRight + 0.1)})`;
  fourth.style.opacity = '1';

  // 4. После анимации
  first.addEventListener('transitionend', function handler() {
    first.removeEventListener('transitionend', handler);
    [first, second, third, fourth].forEach(resetCard);
    wrapper.appendChild(first);
    updateVisibility();
    isAnimating = false;
    toggleButtons(false);
  });
}


// ====== Движение влево ======
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

  // Функции перемещения
  const moveX = (coeff) => `calc(${coeff} * var(--wrapper-w))`;
  const moveY = (coeff) => `calc(${coeff} * var(--wrapper-h))`;

  
  [first, second, third, last].forEach(card => {
    resetCard(card);
    card.style.transition = 'none';
    card.classList.remove('hide');
  });

  
  first.style.transform = `translateX(0px) translateY(${moveY(C.y.slot0)})`;
  first.style.opacity = '1';

  second.style.transform = `translateX(${moveX(-C.stepX*0.01)}) translateY(${moveY(C.y.slot1 - 0.1)})`;
  second.style.opacity = '1';

  third.style.transform = `translateX(${moveX(-C.stepX*0.01)}) translateY(${moveY(C.y.slot2)})`;
  third.style.opacity = '1';

  // last — начальная позиция слева, невидима
  last.style.transform = `translateX(${moveX(-C.stepX * 4)}) translateY(${moveY(C.y.outLeft)})`;
  last.style.opacity = '0';

  void wrapper.offsetHeight;

  // 2. Включаем transition
  [first, second, third, last].forEach(card => {
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  });

  // 3. Конечные позиции (зеркально moveRight)
  first.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.slot1 - 0.1)})`;
  first.style.opacity = '1';

  second.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.slot2)})`;
  second.style.opacity = '1';

  third.style.transform = `translateX(${moveX(C.stepX*1)}) translateY(${moveY(C.y.outLeft)})`;
  third.style.opacity = '0';

  last.style.transform = `translateX(${moveX(-C.stepX*3)}) translateY(${moveY(C.y.slot0)})`;
  last.style.opacity = '1';

  // 4. После анимации
  last.addEventListener('transitionend', function handler() {
    last.removeEventListener('transitionend', handler);
    [first, second, third, last].forEach(resetCard);
    wrapper.appendChild(third);           // third уходит в конец
    wrapper.insertBefore(last, first);    // last встаёт перед first
    updateVisibility();
    isAnimating = false;
    toggleButtons(false);
  });
}
// ====== Инициализация ======
updateWrapperVars();
updateVisibility();

nextBtn.addEventListener('click', moveRight);
prevBtn.addEventListener('click', moveLeft);

// Ресайз
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateWrapperVars();
    // Сбрасываем трансформации, чтобы не было визуальных глюков
    const slides = getSlides();
    slides.forEach(card => {
      card.style.transition = 'none';
      card.style.transform = '';
      card.style.opacity = '';
    });
    updateVisibility();
  }, 200);
});