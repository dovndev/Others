const cont = document.querySelector(".cont");
const navbtn = document.getElementById('navbtn');
const nav = document.getElementById('nav');
const body = document.body

let isdarktheme = false;
let navopen = false;
const table = [
  {
    time: '6:00 AM',
    event: 'Morning Wake Up, Get Fresh'
      },
  {
    time: '6:15 AM',
    event: 'Kurbana'
      },
  {
    time: '6:45 AM',
    event: 'Online Class, Study'
      },
  {
    time: '8:15 AM',
    event: 'Work Outside'
      },
  {
    time: '6:15 AM',
    event: 'Kurbana'
      }
    ]
let html = '';
const start = () => {
  table.map((item, index) => {
    if (index == table.length - 1) {
      html +=
        `<div class="container">
           <div>${item.time}</div>
           <p>${item.event}</p>
           <i class="fa fa-pencil"></i>
           <i class="fa fa-trash"></i>
          </div>
          `
    } else {
      html +=
        `<div class="container">
           <div>${item.time}</div>
           <p>${item.event}</p>
           <i class="fa fa-pencil"></i>
           <i class="fa fa-trash"></i>
          </div>
          <h1>&#8595;</h1>
          `
    }
  })
  cont.innerHTML = html;
}
const handlenav = () => {
  navopen = !navopen;
  let icon = navopen ? '×' : '+';
  let height = navopen ? '200px' : '0px';
  navbtn.innerText = icon;
  nav.style.height = height;
}
const handletheme = (btn) => {
  isdarktheme = !isdarktheme;
  let theme = isdarktheme ? 'dark-theme' : 'light-theme';
  let themeicon = isdarktheme ? 'fa fa-sun' : 'fa fa-moon';
  body.className = theme;
  btn.childNodes[1].className = themeicon;
}
start();