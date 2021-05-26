const htmlinput = document.getElementById("htmlinput");
const styleinput = document.getElementById("styleinput");
const scriptinput = document.getElementById("scriptinput");
const systemresultbox = document.getElementById("systemresultbox");
let extracont = document.querySelector(".extracont");
const systemiframe = document.getElementById("systemiframe");
const systemtooltip = document.getElementById("myTooltip");
const systemnavbar = document.getElementById('systemnavbar');
const theme = document.getElementById("theme");
const textareas = document.getElementsByTagName('textarea');
let systemdefaulttxt = `<!DOCTYPE html>
<html>
<head>
 <title> </title>
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
async function writeToClipboard(code) {
   try {
     await navigator.clipboard.writeText(code);
     alert('copied your code:\n \n' + code);
   } catch (error) {
     console.error(error);
   }
 }

function copyto(input) {
  if (input === "wholecode") {
  var pos = htmlinput.value.indexOf('head');
  const wholecode = htmlinput.value.slice(0, pos + 5) + `\n<style type="text/css" media="all">\n` + styleinput.value + `\n</style>\n<script type="text/javascript" charset="utf-8">\n` + scriptinput.value + `\n</script>` + htmlinput.value.slice(pos + 5);
   writeToClipboard(wholecode);
  }else {
   swift(input);
   let inputvalue = document.getElementById(input).value;
   writeToClipboard(inputvalue);
  }
}
function fillscreen() {
 let togglebtn = document.getElementById('togglebtn');
 let togglebtni = document.getElementById('togglebtni');
 if (togglebtni.classList[1] == "fa-expand"){
   togglebtni.classList.replace('fa-expand' , 'fa-compress');
 }else {
   togglebtni.classList.replace('fa-compress' , 'fa-expand');
 }
 systemresultbox.classList.toggle('systemresultbox2');
}
function opennav() {
  let displayvalue = (systemnavbar.style.display !== 'block') ? 'block' : 'none';
  systemnavbar.style.display = displayvalue;
  navigator.c
}
const hidetext = (bordvalue,inputtype) => {
  let border = document.querySelector(".bordcont");
  border.style['border-bottom'] = '3 px solid black';
  Object.values(textareas).forEach((item) => item.style.display = 'none');
  inputtype.style.display = 'block';
};
function swift(txt) {
if(txt == 'htmlinput') {
 hidetext('flex-start' , htmlinput);
}else if(txt == "styleinput") {
 hidetext('center' , styleinput);
}else {
hidetext('flex-end' , scriptinput);
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
    fontsize = 15 + 'px';
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