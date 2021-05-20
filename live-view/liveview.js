const htmlinput = document.getElementById("htmlinput");
const systemresultbox = document.getElementById("systemresultbox");
const systemiframe = document.getElementById("systemiframe");
const systemtooltip = document.getElementById("myTooltip");
const systemnavbar = document.getElementById('systemnavbar');
let systemdefaulttxt = `<!DOCTYPE html>
<html>
 <head>
  <title></title>
 </head>
 <body>  
 
 </body>
</html>`;
htmlinput.innerHTML = systemdefaulttxt;
const body = document.documentElement;
const styleinput = "style";
const scriptinput = "script";
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
 systemnavbar.style.display = 'none';
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
  systemnavbar.style.display = 'none';
}
run();
function run() {
 const systemcode = `<!DOCTYPE html>
 <html>
 <head>
 <style type="text/css" media="all">
 ` + styleinput + `
 </style>
 <script type="text/javascript" charset="utf-8">
 ` + scriptinput + `
 </script>
 </head>
 <body>
 ` + htmlinput.value + `
 </body>
 </html>`;
 systemiframe.srcdoc = systemcode;
 console.log(systemcode);
}
function copyto() {
  htmlinput.select();
  htmlinput.setSelectionRange(0, 99999);
  document.execCommand("copy");
  systemtooltip.innerHTML = "Copied your code";
  systemnavbar.style.display = 'none';
}
function outFunc() {
  systemtooltip.innerHTML = "Copy to clipboard";
}
function changetheme() {
 var lighttheme = document.getElementById("lighttheme");
 lighttheme.classList.toggle("darktheme");
 systemnavbar.style.display = 'none';
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
  let displayvalue = (systemnavbar.style.display !== 'block') ? 'block' : 'none';
  systemnavbar.style.display = displayvalue;
}