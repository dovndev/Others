const htmlinput = document.getElementById("htmlinput");
const styleinput = document.getElementById("styleinput");
const scriptinput = document.getElementById("scriptinput");
const resultoutput = document.getElementById("resultoutput");
const systemresultbox = document.getElementById("systemresultbox");
let extracont = document.querySelector(".extracont");
const systemiframe = document.getElementById("systemiframe");
const systemtooltip = document.getElementById("myTooltip");
const systemnavbar = document.getElementById('systemnavbar');
const theme = document.getElementById("theme");
const pages = document.querySelectorAll('.pages'); 
const livecheckbox = document.getElementById('liveprev'); 
const body = document.documentElement; 
const runbtn = document.getElementById('runbtn'); 
const livecont = document.getElementById('livecont'); 
const swiftbtn = document.querySelectorAll('.swiftbtn');
const systemheader = document.querySelector('.systemheader');
const systeminputcont = document.getElementById('systeminputcont');
let systemdefaulttxt = `<!DOCTYPE html>
<html>
<head>
 <title> </title>
</head>
<body>
 
</body>
</html>`;
htmlinput.innerHTML = systemdefaulttxt;
prepare();
function prepare() {
 getlayout();
 getsize();
 gettheme();
 setTimeout(() => document.getElementById('loading-page').style.display = 'none' , 1000)
 runbtn.addEventListener('click' , () => {run()})
}
function getlayout() {
 let layoutvalue = JSON.parse(localStorage.getItem('layout'));
 let resultbtn = document.getElementById('resultswift');
 const getlayout1 = () => {
  swift(document.getElementById('htmlswift') , 'htmlinput');
  swiftbtn.forEach((item) => item.style.display = 'block');
  systemheader.classList.remove('header2');
  systeminputcont.classList.remove('systeminputcont2');
  htmlinput.style['padding-top'] = "0px";
  systemresultbox.style.display = 'block';
  resultbtn.style.display = 'block';
  livecont.style.display = 'flex';
  runbtn.addEventListener('click', () => {run()})
  runbtn.removeEventListener('click', () => {run('some')})
  livecheck();
 }
 const getlayout2 = (id) => {
  document.getElementById(id).checked = true;
  run();
  run('some');
 }
 if (layoutvalue === null) {
  return
 }else if (layoutvalue == 'full-page') {
  getlayout1();
  systemresultbox.style.display = 'none';
  resultbtn.style.display = 'block';
  livecheckbox.checked = false;
  livecheck('unchecked');
  livecont.style.display = 'none';
  runbtn.style.display = 'none';
 }else if (layoutvalue == 'four-column')
 {
  getlayout1();
  theme.style['flex-direction'] = layoutvalue;
  systemresultbox.style.display = 'none';
  swiftbtn.forEach((item) => item.style.display = 'none');
  systemheader.classList.add('header2');
  systeminputcont.classList.add('systeminputcont2');
  htmlinput.style['padding-top'] = "50px";
  pages.forEach((page) => page.style.display = 'block');
  runbtn.removeEventListener('click', () => {run()})
  runbtn.addEventListener('click' , () => {run('some')})
  livecheck();
 }else if (layoutvalue == 'column')
 {
  getlayout1();
  resultbtn.style.display = 'none';
  theme.style['flex-direction'] = layoutvalue;
 }else if (layoutvalue == 'row-reverse')
 {
  getlayout1();
  resultbtn.style.display = 'none';
  theme.style['flex-direction'] = layoutvalue;
 }
 else if (layoutvalue == 'row')
 {
   getlayout1();
   resultbtn.style.display = 'none';
   theme.style['flex-direction'] = layoutvalue;
 }else if (layoutvalue == 'column-reverse'){
  getlayout1();
  resultbtn.style.display = 'none';
  theme.style['flex-direction'] = layoutvalue;
 }
 getlayout2(layoutvalue);
}
function getsize() {
 let fontsize;
 if (localStorage.getItem('fontsize') === null) {
  fontsize = 15 + 'px';
 }else {
  fontsize = JSON.parse(localStorage.getItem('fontsize'));
 }
 htmlinput.style['font-size'] = fontsize;
 styleinput.style['font-size'] = fontsize;
 scriptinput.style['font-size'] = fontsize;
 document.getElementById('font-value').innerHTML = fontsize;
}
function gettheme() {
 let themevalue = localStorage.getItem('themevalue');
 if (themevalue !== null) {
  if (themevalue !== 'lighttheme') {
      theme.classList.toggle('darktheme');
  }
 }else {
   theme.classList.toggle('darktheme');
 }
}
function livecheck(status) {
 let livevalue;
 if (status !== undefined) {
  livevalue = status;
 }else {
  livevalue = JSON.parse(localStorage.getItem('livevalue'));
 }
 let input = document.getElementsByTagName('textarea');
 if (livevalue !== null) {
 if (JSON.parse(localStorage.getItem('layout')) == 'four-column') {
  let y;
  if (livevalue == 'checked') {
    for (y = 0; y < input.length; y++) {
      input[y].oninput = () => { run('some') };
    }
    livecheckbox.checked = true;
    runbtn.style.display = 'none';
  } else {
    for (y = 0; y < input.length; y++) {
      input[y].oninput = null;
    }
    livecheckbox.checked = false;
    runbtn.style.display = 'block';
  }
 }else {
  let x;
  if (livevalue == 'checked') {
    for (x = 0; x < input.length; x++) {
      input[x].oninput = () => { run() };
    }
    livecheckbox.checked = true;
    runbtn.style.display = 'none';
  } else {
    for (x = 0; x < input.length; x++) {
      input[x].oninput = null;
    }
    livecheckbox.checked = false;
    runbtn.style.display = 'block';
  }
 }
 }else {
  runbtn.style.display = 'block';
 }
}
function codecreate() {
 let stylecode;
 if (styleinput.value == "" || styleinput.value == " ") {
  stylecode = "";
 }else {
  stylecode = `\n<style type="text/css" media="all">\n` + styleinput.value + `\n</style>`;
 }
 let scriptcode;
 if (scriptinput.value == "" || scriptinput.value == " ") {
  scriptcode = "";
 }else {
  scriptcode = `<script type="text/javascript" charset="utf-8">\n` + scriptinput.value + `\n</script>\n`;
 }
 let html = htmlinput.value;
 let headstart = html.indexOf('<head>') + 6;
 let bodystart = html.indexOf('<body>') + 6;
 let bodyend = html.lastIndexOf('</body>');
 let systemcode = html.slice(0 , headstart) + stylecode + html.slice(headstart , bodystart) + html.slice(bodystart , bodyend) + scriptcode + html.slice(bodyend);
 return systemcode;
}
function run(some) {
 let systemcode = codecreate();
 if (some === undefined) {
  systemiframe.srcdoc = systemcode;
 }else {
  resultoutput.srcdoc = systemcode;
 }
 closenav();
}
function copyto(input) {
  if (input === "wholecode") {
    let systemcode = codecreate();
    writeToClipboard(systemcode);
  } else {
    let inputvalue = document.getElementById(input).value;
    writeToClipboard(inputvalue);
  }
}
async function writeToClipboard(code) {
  try {
    await navigator.clipboard.writeText(code);
    alert('copied your code:\n \n' + code);
  } catch (error) {
    alert(error);
  }
}
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
 closenav();
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
 closenav();
}
function fillscreen() {
 closenav();
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
}
function closenav() {
 systemnavbar.style.display = 'none';
}
function hideinput(btn ,inputtype) {
 swiftbtn.forEach((btns) => btns.classList.remove('swiftbtn2'));
 btn.classList.add('swiftbtn2');
 pages.forEach((page) => page.style.display = 'none');
 inputtype.style.display = 'block';
} 
function swift(id , txt) {
 closenav();
 if(txt == 'htmlinput') {
  hideinput(id , htmlinput);
 }else if(txt == "styleinput") {
  hideinput(id , styleinput);
 }else if (txt == "scriptinput") {
  hideinput(id , scriptinput);
 }else {
  run('some');
  hideinput(id , resultoutput);
 }
}
function toolopen(tool) {
 let item = document.getElementById(tool);
 extracont.style.display = 'flex';
 item.style.display = 'flex';
}
function toolclose() {
 let extratools = document.querySelectorAll(".extratool");
 closenav();
 extracont.style.display = 'none';
 extratools.forEach((item) => { item.style.display = 'none'; });
}
function editsize(fontinput) {
 let fontsize = fontinput.value + 'px';
 localStorage.setItem('fontsize' , JSON.stringify(fontsize));
 getsize();
}
function edittheme() {
 theme.classList.toggle("darktheme");
 if (theme.classList.length == 2) {
   localStorage.setItem("themevalue" , 'darktheme');
 }else {
   localStorage.setItem("themevalue" , 'lighttheme');
 }
}
function editlive(checkbox) {
 if (checkbox.checked === true) {
  localStorage.setItem("livevalue" , JSON.stringify('checked'));
 }else {
  localStorage.setItem("livevalue" , JSON.stringify('unchecked'));
 }
 livecheck();
}
function editlayout(radioinput) {
 let layoutvalue = JSON.stringify(radioinput.value);
 localStorage.setItem('layout', layoutvalue);
 getlayout();
}