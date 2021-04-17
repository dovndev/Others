const systeminput = document.getElementById("systeminput");
const systemresultbox = document.getElementById("systemresultbox");
const systemiframe = document.getElementById("systemiframe");
const systemdefaulttxt = "<!DOCTYPE html>                                             <html>                                                    <head>                                                   <title>   </title>                                       </head>                                                   <body>   </body>                                         </html>";
systeminput.innerText = systemdefaulttxt;
 console.log(systemdefaulttxt);
function run() {
 systemiframe.srcdoc = systeminput.value;
}