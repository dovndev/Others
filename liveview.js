const systeminput = document.getElementById("systeminput");
const systemresultbox = document.getElementById("systemresultbox");
const systemiframe = document.getElementById("systemiframe");
const systemheader = document.getElementById(systemheader);

const systemdefaulttxt = "<!DOCTYPE html>                                             <html>                                                    <head>                                                   <title>   </title>                                       </head>                                                   <body>                                                        </body>                                                    </html>";

  systeminput.innerText = systemdefaulttxt;
  
function run() {
 systemiframe.srcdoc = systeminput.value;
}