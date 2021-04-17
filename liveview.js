const systeminput = document.getElementById("systeminput");
const systemresultbox = document.getElementById("systemresultbox");
const systemiframe = document.getElementById("systemiframe");
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