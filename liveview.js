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
if(body.requestFullscreen){
  body.requestFullscreen();
}
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