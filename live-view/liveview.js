const htmlinput = document.getElementById("htmlinput");
const styleinput = document.getElementById("styleinput");
const scriptinput = document.getElementById("scriptinput");
const systemresultbox = document.getElementById("systemresultbox");
let extracont = document.querySelector(".extracont");
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
 ` + styleinput.value + `
 </style>
 <script type="text/javascript" charset="utf-8">
 ` + scriptinput.value + `
 </script>
 </head>
 <body>
 ` + htmlinput.value + `
 </body>
 </html>`;
 systemiframe.srcdoc = systemcode;
}
function copyto(input) {
  swift(input);
  let inputi = document.getElementById(input);
  inputi.select();
  inputi.setSelectionRange(0, 99999);
  document.execCommand("copy");
 alert("copied your code\n" + inputi.value);
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
function swift(txt) {
let border = document.querySelector(".bordcont");
if(txt == 'htmlinput') {
 htmlinput.style.display = 'block';
 styleinput.style.display = 'none';
 scriptinput.style.display = 'none';
 border.style['justify-content'] = 'flex-start';
}else if(txt == "styleinput") {
 htmlinput.style.display = 'none';
 styleinput.style.display = 'block';
 scriptinput.style.display = 'none';
 border.style['justify-content'] = 'center';
}else {
 htmlinput.style.display = 'none';
 styleinput.style.display = 'none';
scriptinput.style.display = 'block';
border.style['justify-content'] = 'flex-end';
 }
}
function toolopen(tool) {
  let item = document.getElementById(tool);
  extracont.style.display = 'flex';
  item.style.display = 'block';
}
function toolclose() {
 let extratools = document.querySelectorAll(".extratool");
 setTimeout(() => {extracont.style.display = 'none';
   extratools.forEach((item) => { item.style.display = 'none'; });},100)
}