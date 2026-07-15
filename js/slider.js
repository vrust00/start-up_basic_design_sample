const wrapper = document.querySelector('.slider__wrapper');
const prevBtn = document.querySelector('.slider__btn.prev');
const nextBtn = document.querySelector('.slider__btn.next');

function getSlides() {
   return wrapper.children;
}

function updateVisibility() {
   const slides = getSlides();
   // Отключаем transition перед изменением классов
   for (let i = 0; i < slides.length; i++) {
      slides[i].style.transition = 'none';
   }
   // Форсируем перерисовку
   void document.body.offsetHeight;

   for (let i = 0; i < slides.length; i++) {
      slides[i].classList.toggle('hide', i >= 3);
   }

   // Можно вернуть transition обратно, но мы этого не делаем,
   // потому что будем включать его только перед анимацией.
   // Если оставить 'none', то при следующей анимации мы его переопределим.
}

function moveRight() {
   const slides = getSlides();
   if (slides.length < 4) return;

   const first = slides[0];
   const second = slides[1];
   const third = slides[2];
   const fourth = slides[3];

   // 1. Убеждаемся, что transition отключён
   const cards = [first, second, third, fourth];
   cards.forEach(el => el.style.transition = 'none');
   void document.body.offsetHeight;

   // 2. Устанавливаем начальные позиции (если нужно) — здесь они уже есть
   // Просто сбрасываем всё, что могло остаться
   cards.forEach(el => {
      el.style.transform = '';
      el.style.opacity = '';
   });
   // Но четвёртая должна быть скрыта? Нет, она будет анимироваться.
   // Убедимся, что у четвёртой нет hide
   fourth.classList.remove('hide');

   
   first.style.transform = 'translateX(-11vw) translateY(5vw)';
   first.style.opacity = '0';
   second.style.transform = 'translateX(-20.9vw) translateY(4vw)';
   third.style.transform = 'translateX(-20.9vw) translateY(-4vw)';
   fourth.style.transform = 'translateX(-20.9vw) translateY(4vw)';
   fourth.style.opacity = '1';

   // 4. Включаем transition
   cards.forEach(el => {
      el.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
   });

   // 5. Ждём окончания анимации
   first.addEventListener('transitionend', function handler() {
      first.removeEventListener('transitionend', handler);

      // 6. Отключаем transition
      cards.forEach(el => el.style.transition = 'none');

      // 7. Сбрасываем transform и opacity
      cards.forEach(el => {
         el.style.transform = '';
         el.style.opacity = '';
      });

      // 8. Переставляем первую в конец
      wrapper.appendChild(first);

      // 9. Убираем hide у первой
      first.classList.remove('hide');

      // 10. Обновляем видимость (transition уже отключён)
      updateVisibility();
   });
}

function moveLeft() {
   const slides = getSlides();
   if (slides.length < 4) return;

   const first = slides[0];
   const second = slides[1];
   const third = slides[2];
   const last = slides[slides.length - 1];
   const cards = [first, second, third, last];

   // 1. Отключаем transition и сбрасываем всё
   cards.forEach(el => {
      el.style.transition = 'none';
      el.style.transform = '';
      el.style.opacity = '';
   });
   void document.body.offsetHeight;

   // 2. Убираем hide у всех, кто участвует
   cards.forEach(el => el.classList.remove('hide'));

   // 3. Задаём НАЧАЛЬНЫЕ состояния (до включения transition)
   // last — далеко слева за экраном
   last.style.transform = 'translateX(-11vw) translateY(4vw)';
   last.style.opacity = '0';

   // Остальные остаются на своих местах (без transform)
   // Но чтобы они не дёргались, явно задаём opacity=1
   first.style.opacity = '1';
   second.style.opacity = '1';
   third.style.opacity = '1';
   // Убеждаемся, что у них нет transform
   first.style.transform = '';
   second.style.transform = '';
   third.style.transform = '';

   // 4. Принудительная перерисовка (чтобы начальные состояния применились)
   requestAnimationFrame(() => {
      requestAnimationFrame(() => {
         // 5. Включаем transition
         cards.forEach(el => {
            el.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
         });

         // 6. Задаём КОНЕЧНЫЕ состояния
         // last выезжает на своё место
         last.style.transform = 'translateX(20.9vw) translateY(4vw)';
         last.style.opacity = '1';

         // third уходит вправо и исчезает
         third.style.transform = 'translateX(20vw) translateY(4vw)';
         third.style.opacity = '0';

         // second сдвигается вправо
         second.style.transform = 'translateX(20vw) translateY(4vw)';

         // first сдвигается вправо-вверх
         first.style.transform = 'translateX(20vw) translateY(-4vw)';
         first.style.opacity = '1';

         // 7. Ждём окончания анимации
         last.addEventListener('transitionend', function handler() {
            last.removeEventListener('transitionend', handler);
            cards.forEach(el => {
               el.style.transition = 'none';
               el.style.transform = '';
               el.style.opacity = '';
            });
            wrapper.insertBefore(last, slides[0]);
            updateVisibility();
         });
      });
   });
}

nextBtn.addEventListener('click', moveRight);
prevBtn.addEventListener('click', moveLeft);

updateVisibility();