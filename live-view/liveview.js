const systeminput = document.getElementById("systeminput");
const systemresultbox = document.getElementById("systemresultbox");
const systemiframe = document.getElementById("systemiframe");
const systemtooltip = document.getElementById("myTooltip");
let systemdefaulttxt = `<!DOCTYPE html>
<html>
 <head>
  <title>     </title>
 </head>
 <body>  
    
 </body>
</html>`;
const body = document.documentElement;
function fullscreen() {
  let fullscreenbtn = document.getElementById('fullscreenbtn');
if(body.requestFullscreen){
  body.requestFullscreen();
}else if (body.webkitRequestFullscreen) {
  body.webkitRequestFullscreen();
}else if (body.msRequestFullscreen) {
  body.msRequestFullscreen();
}
 fullscreenbtn.style.display = "none";
 exitfullscreenbtn.style.display = "flex";
}
function exitfullscreen() {
  let exitfullscreenbtn = document.getElementById('exitfullscreenbtn');
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  fullscreenbtn.style.display = "flex";
  exitfullscreenbtn.style.display = "none";
}
systeminput.innerHTML = systemdefaulttxt;
function run() {
 systemiframe.srcdoc = systeminput.value;
}
function copyto() {
  systeminput.select();
  systeminput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  systemtooltip.innerHTML = "Copied your code";
}
function outFunc() {
  systemtooltip.innerHTML = "Copy to clipboard";
}
function changetheme() {
 var lighttheme = document.getElementById("lighttheme");
 lighttheme.classList.toggle("darktheme");
}
function fillscreen() {
 let togglebtn = document.getElementById('togglebtn');
 let togglebtni = document.getElementById('togglebtni');
 if (togglebtni.classList[1] == "fa-expand"){
   togglebtni.classList.add('fa-compress');
   togglebtni.classList.remove('fa-expand');
 }else {
   togglebtni.classList.remove('fa-compress');
   togglebtni.classList.add('fa-expand');
 }
 systemresultbox.classList.toggle('systemresultbox2');
}
function opennav() {
  let systemnavbar = document.getElementById('systemnavbar');
  let displayvalue = (systemnavbar.style.display !== 'block') ? 'block' : 'none';
  systemnavbar.style.display = displayvalue;
}