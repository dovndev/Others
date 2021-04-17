const systeminput = document.getElementById("systeminput");
const systemresultbox = document.getElementById("systemresultbox");
const systemiframe = document.getElementById("systemiframe");
let systemdefaulttxt ="<!DOCTYPEhtml> <html>  <head>   <title>   </title>  </head>  <body>  </body> </html>";
const breakString = (str, limit) => {
  let brokenString = '';
  for (let i = 0, count = 0; i < str.length; i++) {
    if (count >= limit && str[i] === ' ') {
      count = 0;
      brokenString += '\n';
    } else {
      count++;
      brokenString += str[i];
    }
  }
  return brokenString;
}
systeminput.innerHTML = breakString(systemdefaulttxt, 4);
function run() {
 systemiframe.srcdoc = systeminput.value;
}