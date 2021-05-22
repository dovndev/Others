const htmlinput = document.getElementById("htmlinput");
const styleinput = document.getElementById("styleinput");
const scriptinput = document.getElementById("scriptinput");
const systemresultbox = document.getElementById("systemresultbox");
let extracont = document.querySelector(".extracont");
const systemiframe = document.getElementById("systemiframe");
const systemtooltip = document.getElementById("myTooltip");
const systemnavbar = document.getElementById('systemnavbar');
const theme = document.getElementById("theme");
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
  document.execCommand('copy');
  alert("copied your code to clipboard\n" + inputi.value);
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
  item.style.display = 'flex';
}
function toolclose() {
 let extratools = document.querySelectorAll(".extratool");
 setTimeout(() => {extracont.style.display = 'none';
   extratools.forEach((item) => { item.style.display = 'none'; });},100)
}
getsize();
function getsize() {
  let fontsize;
  if (localStorage.getItem('fontsize') === null) {
    fontsize = 20 + 'px';
  }else {
    fontsize = JSON.parse(localStorage.getItem('fontsize'));
  }
  changesize(fontsize);
}
function changesize(fontsize) {
 htmlinput.style['font-size'] = fontsize;
 styleinput.style['font-size'] = fontsize;
 scriptinput.style['font-size'] = fontsize;
 document.getElementById('font-value').innerHTML = fontsize;
}
function editsize(fontinput) {
  let fontsize = fontinput.value + 'px';
  localStorage.setItem('fontsize' , JSON.stringify(fontsize));
  changesize(fontsize);
}
gettheme();
function gettheme() {
let themevalue = localStorage.getItem('themevalue');
if (themevalue !== null) {
 if (themevalue !== 'lighttheme') {
   theme.classList.toggle('darktheme');
 }
}
}
function changetheme() {
 theme.classList.toggle("darktheme");
 if (theme.classList.length == 2) {
   localStorage.setItem("themevalue" , 'darktheme');
 }else {
   localStorage.setItem("themevalue" , 'lighttheme');
 }
}
livecheck();
function livecheck() {
 let livevalue = localStorage.getItem('livevalue');
 let input = document.getElementsByTagName('textarea');
 let x;
 if (livevalue !== null) {
  if (livevalue == 'checked') {
  for (x = 0; x < input.length; x++) {
    input[x].oninput = run;
    document.getElementById('liveprev').checked = true;
  }
  }else {
    for (x = 0; x < input.length; x++) {
      input[x].oninput = null;
      document.getElementById('liveprev').checked = false;
    }
  }
 }
}
livechange(document.getElementById('liveprev'));
function livechange(checkbox) {
  let runbtn = document.querySelector('.runbtn');
  if (checkbox.checked === true) {
    localStorage.setItem("livevalue" , 'checked');
    runbtn.style.display = 'none';
  }else {
    localStorage.setItem("livevalue" , 'unchecked');
    runbtn.style.display = 'block';
  }
  livecheck();
}