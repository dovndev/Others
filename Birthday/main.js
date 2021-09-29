const img = document.getElementById('img');
const song = document.getElementById('song');
const cover = document.querySelector('.cover');
let index = 0;

function ChangeSrc() {
  if(index > 10)index = 0;
  const src = `./Images/Img${index}.jpg`;
  img.classList.add('blur');
  setTimeout(() => {
    img.src = src;
    img.classList.remove('blur')
    index++;
  }, 1000)
}

function loadImages() {
  let i;
  for (i = 0; i < 10; i++) {
    fetch(`./Images/Img${i}.jpg`)
  }
}

loadImages();

function Start() {
  setInterval(ChangeSrc , 4000);
  cover.style.display = 'none';
  song.controls = false;
  song.playbackRate = 0.6;
  song.play();
}