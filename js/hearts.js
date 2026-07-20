const container = document.querySelector('.first-date__hearts-container');

function createHeart() {
   const heart = document.createElement('div');
   heart.className = 'heart';   
   heart.style.backgroundImage = 'url("images/heart.png")';
   heart.style.left = Math.random() * 100 + 'vw'; 
   heart.style.fontSize = Math.random() * 30 + 20 + 'px'; 
   
   heart.style.width = Math.random() * 3 + 3 + 'vw';   
   heart.style.height = heart.style.width;
   heart.style.backgroundSize = 'contain';
   heart.style.backgroundRepeat = 'no-repeat';
   heart.style.backgroundPosition = 'center';
   heart.style.animationDuration = Math.random() * 4 + 3 + 's'; 
   
   
   container.appendChild(heart);

   
   setTimeout(() => heart.remove(), 7000);
}


setInterval(createHeart, 100);