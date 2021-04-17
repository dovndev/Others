const systeminput = document.getElementById("systeminput");
const systemresultbox = document.getElementById("systemresultbox");
const systemiframe = document.getElementById("systemiframe");
 console.log(systemiframe.srcdoc);
function run() {
 systemiframe.srcdoc = systeminput.value;
}