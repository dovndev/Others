const htmlinput = document.getElementById("htmlinput");
const styleinput = document.getElementById("styleinput");
const scriptinput = document.getElementById("scriptinput");
const resultoutput = document.getElementById("resultoutput");
let extracont = document.querySelector(".extracont");
const systemiframe = document.getElementById("systemiframe");
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
 gettheme();
 getfamily();
 getfontsize();
 livecheck();
 document.getElementById('loading-page').style.display = 'none';
}
function getlayout() {
 let layoutvalue = JSON.parse(localStorage.getItem('layout'));
 let resultbtn = document.getElementById('resultswift');
 const getlayout1 = () => {
  swift(document.getElementById('htmlswift') , 'htmlinput' , true);
  swiftbtn.forEach((item) => item.style.display = 'block');
  systeminputcont.classList.remove('systeminputcont2');
  resultbtn.style.display = 'block';
  livecont.style.display = 'flex';
  livecheck();
 }
 const getlayout2 = (id) => {
  document.getElementById(id).checked = true;
  run();
 }
 if (layoutvalue === null) {
  return
 }else if (layoutvalue == 'full-page') {
  getlayout1();
  resultoutput.parentNode.style.display = 'none';
  resultbtn.style.display = 'block';
  livecheckbox.checked = false;
  livecheck('unchecked');
  livecont.style.display = 'none';
  runbtn.style.display = 'none';
 }else if (layoutvalue == 'four-column') {
  getlayout1();
  swiftbtn.forEach((item) => item.style.display = 'none');
  systeminputcont.classList.add('systeminputcont2');
  pages.forEach((page) => page.style.display = 'block');
  livecheck();
 }else if (layoutvalue == 'column') {
  getlayout1();
  resultbtn.style.display = 'none';
  systeminputcont.style['flex-direction'] = layoutvalue;
 }else if (layoutvalue == 'row-reverse') {
  getlayout1();
  resultbtn.style.display = 'none';
  systeminputcont.style['flex-direction'] = layoutvalue;
 }
 else if (layoutvalue == 'row') {
  getlayout1();
  resultbtn.style.display = 'none';
  systeminputcont.style['flex-direction'] = layoutvalue;
 }else if (layoutvalue == 'column-reverse') {
  getlayout1();
  resultbtn.style.display = 'none';
  systeminputcont.style['flex-direction'] = layoutvalue;
 }
 getlayout2(layoutvalue);
}
function getfontsize() {
  let fontsize;
  let savedvalue = JSON.parse(localStorage.getItem('fontsize'));
  if (savedvalue !== null) {
    fontsize = Number(savedvalue);
  }else {
    fontsize = 17;
  }
   htmlinput.style['font-size'] = fontsize + 'px';
   styleinput.style['font-size'] = fontsize + 'px';
   scriptinput.style['font-size'] = fontsize + 'px';
   document.getElementById('font-value').innerText = fontsize + 'px';
   document.getElementById('font-input').value = fontsize;
}
function getfamily() {
 let fontfamily;
 if (localStorage.getItem('fontfamily') === null) {
  fontfamily = 'monospace';
 }else {
  fontfamily = JSON.parse(localStorage.getItem('fontfamily'));
 }
 htmlinput.style['font-family'] = fontfamily;
 styleinput.style['font-family'] = fontfamily;
 scriptinput.style['font-family'] = fontfamily;
 document.getElementById(fontfamily).checked = true;
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
function livecheck() {
 let livevalue;
 let localvalue = JSON.parse(localStorage.getItem('livevalue'));
 if (localvalue !== null) {
  livevalue = localvalue;
 }else {
  livevalue = 'unchecked';
  runbtn.style.display = 'block';
 }
  if (livevalue == 'checked') {
    setlive(run , true , 'none');
  }else {
    setlive(null , false , 'block');
  }
  function setlive(funcv , checkv , displayv) {
    let x;
    let input = document.getElementsByTagName('textarea');
    for (x = 0; x < input.length; x++) {
      input[x].oninput = funcv;
    }
    livecheckbox.checked = checkv;
    runbtn.style.display = displayv;
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
function run() {
   let systemcode = codecreate();
   resultoutput.srcdoc = systemcode;
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
function opennav() {
 systemnavbar.style.display = (systemnavbar.style.display !== 'block') ? 'block' : 'none';
}
function closenav() {
 systemnavbar.style.display = 'none';
}
function swift(id , txt , inputtype2) {
 closenav();
 if(txt == 'htmlinput') {
  hideinput(id , htmlinput.parentNode , inputtype2);
 }else if(txt == "styleinput") {
  hideinput(id , styleinput.parentNode , inputtype2);
 }else if (txt == "scriptinput") {
  hideinput(id , scriptinput.parentNode , inputtype2);
 }else {
  run();
  hideinput(id , resultoutput.parentNode);
 }
}
function hideinput(btn, inputtype, inputtype2) {
  swiftbtn.forEach((btns) => btns.classList.remove('swiftbtn2'));
  btn.classList.add('swiftbtn2');
  pages.forEach((page) => page.style.display = 'none');
  inputtype.style.display = 'block';
  if (inputtype2 == true & JSON.parse(localStorage.getItem('layout')) !== 'full-page') {
    resultoutput.parentNode.style.display = 'block';
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
function editfamily(fontinput) {
 let fontfamily = fontinput.value;
 localStorage.setItem('fontfamily' , JSON.stringify(fontfamily));
 getfamily();
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
function editfontsize(rangeinput) {
  let fontsizev = JSON.stringify(rangeinput.value);
  localStorage.setItem('fontsize', fontsizev);
  getfontsize();
}