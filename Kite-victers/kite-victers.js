const loadingpage = document.getElementById('loadingpage');
const lightmode = document.getElementById('lightmode');
const nav = document.getElementById('contain');
const container = document.getElementById('id01');
let playlists = ['https://youtube.com/embed/playlist?list=PLFMb-2_G0bMau68HbXU4ypYz-o59vpoaG','https://youtube.com/embed/playlist?list=PLFMb-2_G0bMZuZvntGy8DrGKkAti1Di4u','https://www.youtube.com/embed/playlist?list=PLFMb-2_G0bMZaBEYbyJqAzFJQzrMP-rvk','https://www.youtube.com/embed/playlist?list=PLFMb-2_G0bMYQ8Op027UCqz8JIUE4rMUQ','https://www.youtube.com/embed/playlist?list=PLFMb-2_G0bMbOjs8KWhc0JK8zsml0yI80','https://www.youtube.com/embed/playlist?list=PLFMb-2_G0bMbO0oEufakkx3M7z8J0O0H7','https://www.youtube.com/embed/playlist?list=PLFMb-2_G0bMYw1qyRJPLVrvjcvu-TeCGA','https://www.youtube.com/embed/playlist?list=PLFMb-2_G0bMZABEoPbXhJhaUxkHoz90lP','https://www.youtube.com/embed/playlist?list=PLFMb-2_G0bMZWraocvgXUy6WiccGjMEiO','https://youtube.com/embed/playlist?list=PLFMb-2_G0bMYcln_EAAqYNW4yx2cvAQI8','https://www.youtube.com/embed/playlist?list=PLFMb-2_G0bMY97I0VnAIwmOqfCh9eM0bW','https://youtube.com/embed/playlist?list=PLFMb-2_G0bMZ8CtVtNkxRT5wbsI-JZVR4'];
  prepare();
  loadingpage.style.display = 'none';
  lightmode.style.display = 'block';
  let counter = 0;
function loader() {
  counter++
  let per = Math.floor(100 / 12 * counter);
  document.getElementById('loadnum').innerText = per + '%';
  document.getElementById('loadbar').style.width = per + '%';
  if (counter >= 12) {
    loadingpage.style.display = 'none';
    lightmode.style.display = 'block';
  }
}
function prepare() {
  let text = "";
  let i = 0;
  for (i; i < playlists.length; i++) {
    let num1 = i + 1;
    let num2 = i + 2;
    let id = (num2 >= 10) ? 'id' + num2 : 'id0' + num2 ;
    text = `<div class="grid-item">
              <div class="container">
                <iframe onload="loader()" class="responsive-iframe" id="player${i}" type="text/html" src="${playlists[i]}" frameborder="0" allowfullscreen></iframe>
              </div> <p id="${id}" class="classdetail">KITE VICTERS STD ${num1} Latest Class first bell</p>
               </div>`;
    container.innerHTML += text;
  }
}

function toggletheme() {
  lightmode.classList.toggle("darkmode");
}

function animbars(x) {
  x.classList.toggle("change1");
}

function opennav() {
  nav.classList.toggle("contain1");
}