const x = document.getElementById("signupform");
const y = document.getElementById("loginform");
const navmenu = document.getElementById("dropdownmenu");
const menubutton = document.getElementById("menu");


function closeopen() {
  
  let zero = 0;
  let hundred = 100;
  let neghundred = -100;
  
  if (y.style.transform == `translateX(${zero}%)`) {
    y.style.transform = `translateX(${hundred}%)`;
    x.style.transform = `translateX(${zero}%)`;
  } else {
    x.style.transform = `translateX(${neghundred}%)`;
    y.style.transform = `translateX(${zero}%)`;
  }
}

function dropmenu() {
  
  navmenu.classList.toggle("dropdownmenu2");
  menubutton.classList.toggle("menuchange");
}