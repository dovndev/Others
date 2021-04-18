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

systeminput.innerHTML = systemdefaulttxt;
function run() {
 systemiframe.srcdoc = systeminput.value;
}
function copyto() {
  var copyText = document.getElementById("systeminput");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  systemtooltip.innerHTML = "Copied your code";
}
function outFunc() {
  systemtooltip.innerHTML = "Copy to clipboard";
}
function changetheme() {
  
}