function closeopen() {
  let x = document.getElementById("signupform");
  let y = document.getElementById("loginform");
  if (y.style.transform =   translateX('0%')) {
    x.style.transform = translateX('0%');
    y.style.transform = translateX('100%');
  } else {
    x.style.transform = translateX('-100%');
    y.style.transform = translateX('0%');
  }
}