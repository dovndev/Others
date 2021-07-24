const cont = document.querySelector(".cont");
const navbtn = document.getElementById('navbtn');
const nav = document.getElementById('nav');
const body = document.body
const timeinput = document.getElementById('timeinput');
const txtinput = document.getElementById('txtinput');
let htmltable = document.querySelectorAll('.container');

let isdarktheme = false;
let navopen = false;
let table = JSON.parse(localStorage.getItem('table'));

document.onclick = (e) => {
  if (e.target.getAttribute('item') != 'nav') {
    navopen = false;
    let icon = navopen ? '×' : '+';
    let height = navopen ? '200px' : '0px';
    navbtn.innerText = icon;
    nav.style.height = height;
  }else return;
}
const addhtmlelmnt = ({time,txt,id}, pos) => {
  let h = Number(time.split(':')[0]);
  let m = time.split(':')[1];
  let h1 = h > 12 ? h - 12 + `:${m} PM`: h + `:${m}AM`;
  let formattedtime = Number(h1.slice(0, -6)) < 10 ? '0' + h1: h1;
  let newelmnt = 
  `<div class="container">
    <div>${formattedtime}</div>
    <p>${txt}</p>
    <i class="fa fa-pencil"></i>
    <i class="fa fa-trash"></i>
  </div>
  `;
  let elmnt;
  let place;
  if (pos != null) {
    elmnt = pos.elmnt;
    place = pos.place;
  }
  if (pos == null) {
    cont.innerHTML = newelmnt;
  }else if (pos.place == 'afterend') {
    elmnt.insertAdjacentHTML(pos.place, newelmnt);
    elmnt.insertAdjacentHTML(pos.place, '<h1>&darr;</h1>');
  }else {
    elmnt.insertAdjacentHTML(pos.place, newelmnt);
  }
}
const start = () => {
  if (table) {
    table.map((item, index) => {
      htmltable = document.querySelectorAll('.container');
      if (htmltable.length == 0) {
        addhtmlelmnt(item, null);
      }else {
        addhtmlelmnt(item, {
          elmnt: htmltable[index - 1],
          place: 'afterend'
        })
      }
    })
  }
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

const sort = (a , b) => {
  ah = a.time.split(':');
  am = ah[0] * 60 + ah[1]
  bh = b.time.split(':');
  bm = bh[0] * 60 + bh[1]
  return am - bm;
}
const validate = (time, txt) => {
  if (time) {
    if (txt) {
      return null;
    }else {
      return 'Enter an Event'
    }
    return null;
  }else {
    return 'Enter Time'
  }
}
const additem = (newitem) => {
  table.push(newitem);
  table.sort(sort);
  localStorage.setItem('table', JSON.stringify(table));
  let position = table.indexOf(newitem);
  let positem = (position == 0) ? {
    elmnt: htmltable[position],
    place: 'beforebegin'
  } : {
    elmnt: htmltable[position - 1],
    place: 'afterend'
  };
  if (table.length == 1) {
    positem = null;
  }
  addhtmlelmnt(newitem, positem)
}
const handleform = (event) => {
  event.preventDefault();
  htmltable = document.querySelectorAll('.container');
  let time = timeinput.value;
  let txt = txtinput.value;
  const status = validate(time, txt);
  if (status) {
    alert(status);
  }else {
  let id = new Date().getTime();
  if (table == null) {
    localStorage.setItem('table', JSON.stringify([]));
    table = JSON.parse(localStorage.getItem('table'));
  }
  let newitem = {
    time,
    txt,
    id
  }
  additem(newitem);
  timeinput.value = '';
  txtinput.value = '';
  }
}
start();