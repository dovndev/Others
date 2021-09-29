const img = document.getElementById('img');
const song = document.getElementById('song');
const cover = document.querySelector('.cover');
let index = 0;

function ChangeSrc() {
  if (index > 10) index = 0;
  img.classList.add('blur');
  setTimeout(() => img.src = `./Images/Img${index}.jpg`, 500)
  img.onload = () => {
    setTimeout(ChangeSrc, 4000);
    setTimeout(() => img.classList.remove('blur'), 500);
    index++;
  }
  
  img.onerror = () => {
    index++;
    ChangeSrc();
  }
}

function Start() {
  setTimeout(ChangeSrc , 4000);
  cover.style.display = 'none';
  song.controls = false;
  song.playbackRate = 0.6;
  song.play();
}