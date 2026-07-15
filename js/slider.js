const slider = document.querySelector('.slider')
const prev_btn = document.querySelector('.slider__btn.prev')
const next_btn = document.querySelector('.slider__btn.next')
const wrapper = document.querySelector('.slider__wrapper')
const dotsContainer = slider.querySelector('.slider__dots');

const slides = document.querySelectorAll('.slider__slide')
const card_count = slides.length 

let curIndex = 0;
let cards = [];

for(let i=0; i<card_count; i++){
   cards.push(i);
}
console.log(cards)




for(let i=3; i<card_count; i++){
   slides[i].classList.add('hide')
   slides[i].classList.add('hide')
}

// function goToSlide() {
//    if (index+1 > )
// }