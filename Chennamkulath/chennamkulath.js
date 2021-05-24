function myFunction() {
  var x = document.getElementById("dropdowncontent");
  var y = document.getElementById("container");
  var g = document.getElementById("welcome");
    x.classList.toggle("displaydropdown");
    y.classList.toggle("change");
}

function clock(){
  
  var hours = document.getElementById("hours");
  var Minutes = document.getElementById("Minutes");
  var Seconds = document.getElementById("Seconds");
  var ampm = document.getElementById("ampm");
  
  var h = new Date().getHours();
  var m = new Date().getMinutes();
  var s = new Date().getSeconds();
  var am = "AM";
  
  if(h > 12){
    h = h - 12;
    var am = "PM"
  }
  
  h = (h < 10) ? "0" + h : h
  m = (m < 10) ? "0" + m : m
  s = (s < 10) ? "0" + s : s
  
  hours.innerHTML = h;
  Minutes.innerHTML = m;
  Seconds.innerHTML = s;
  ampm.innerHTML = am;
}

 setInterval(clock,1000);
 
 
function topnavanimationquit(){
  
}