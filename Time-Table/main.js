const cont = document.querySelector(".cont");
const navbtn = document.getElementById('navbtn');
const nav = document.getElementById('nav');
const body = document.body
const timeinput = document.getElementById('timeinput');
const txtinput = document.getElementById('txtinput');
const themebtn = document.getElementById('themebtn');
let htmltable = document.querySelectorAll('.container');


let isdarktheme = false;
let navopen = false;
let table = JSON.parse(localStorage.getItem('table'));
let i_elmnt;
let isfirst = true;
let lastadded;


const updatehtml = 
({
  type, 
  item: {
    time = null, 
    txt = null, 
    id = null
  }, 
  pos: {
    elmnt = null, 
    place = null
  }
}) => {
  switch (type) {
    case 'ADD_ELMNT': {
      let [ _h, m ] = time.split(':');
      let h = Number(_h > 12 ? _h - 12 : _h);
      h = h || 12;
      h = h < 10 ? '0' + h : h;
      let formattedtime = _h < 12 ? h + `:${m} AM`: h + `:${m} PM`
      let newelmnt =
        `<div id="${id}" class="container container2">
          <div>${formattedtime}</div>
          <p>${txt}</p>
          <i onclick="handledelete(this, ${id})"  class="fa fa-trash"></i>
        </div>
        `;
      if (place == null) {
        cont.innerHTML = newelmnt;
      }else {
        elmnt.insertAdjacentHTML(place, newelmnt);
      }
      lastadded = document.getElementById(id);
      set1elmnt();
    }
    break;
    case 'DELETE_ELMNT': {
      elmnt.classList.add('remove');
      setTimeout(() => elmnt.remove(), 1000);
    }
  }
  set1elmnt();
}


const set1elmnt = () => {
  htmltable = document.querySelectorAll('.container');
  if (htmltable.length) htmltable[0].classList.remove('container2');
}


const scrollelmnt = () => {
  htmltable = document.querySelectorAll('.container');
  if (htmltable.length) {
  if (isfirst) {
    let array = [];
    table.forEach(item => {
      ah = item.time.split(':');
      am = Number(ah[0]) * 60 + Number(ah[1]);
      bh = new Date();
      bm = bh.getHours() * 60 + bh.getMinutes();
      array.push(bm - am);
    });
    let goal = 0;
    let closest = array.reduce(function(prev, curr) {
      return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
    i_elmnt = htmltable[array.indexOf(closest)];
    isfirst = false;
  }else {
    i_elmnt = lastadded;
  }
  i_elmnt.scrollIntoView();
  }
}


const settheme = () => {
  let theme = isdarktheme ? 'dark-theme' : 'light-theme';
  let themeicon = isdarktheme ? 'fa fa-sun' : 'fa fa-moon';
  body.className = theme;
  themebtn.className = themeicon;
}


const start = () => {
  if (table) {
    table.map((item, index) => {
      set1elmnt();
      if (htmltable.length == 0) {
        updatehtml({
          type: 'ADD_ELMNT',
          item: item,
          pos: {}
        });
      }else {
        updatehtml({
          type: 'ADD_ELMNT',
          item: item,
          pos: {
            elmnt: htmltable[index - 1],
            place: 'afterend'
          }
        })
      }
    })
  }
  isdarktheme = JSON.parse(localStorage.getItem('table-dtheme'));
  settheme();
}
 
 
start();
setTimeout(scrollelmnt, 1000);

const sort = (a, b) => {
  ah = a.time.split(':');
  am = ah[0] * 60 + ah[1]
  bh = b.time.split(':');
  bm = bh[0] * 60 + bh[1]
  return am - bm;
}


const updatedb = ({method, newitem = null, id = null}) => {
  const fix = () => localStorage.setItem('table', JSON.stringify(table));
  switch (method) {
    case 'ADD': {
      table.push(newitem);
      table.sort(sort);
      fix();
    }
    break;
    case 'DELETE' : {
      table = table.filter(item => {
        return item.id != id;
      })
      fix();
    }
  }
}


const handleinput = () => {
  let time = timeinput.value;
  let txt = txtinput.value;
  if (time) {
    if (txt) {
      timeinput.value = '';
      txtinput.value = '';
      handlenav();
      return {time,txt};
    } else {
      return { status: 'Enter an Event' }
    }
    timeinput.value = '';
    txtinput.value = '';
    handlenav();
    return {time,txt};
  } else {
    return { status: 'Enter Time' }
  }
}


const handlenav = () => {
  navopen = !navopen;
  let icon = navopen ? '×' : '+';
  let height = navopen ? '200px' : '0px';
  navbtn.innerText = icon;
  nav.style.height = height;
  document.body.scrollIntoView();
}


const closenav = (e) => {
  if (e.target.getAttribute('item') != 'nav') {
    navopen = false;
    let icon = navopen ? '×' : '+';
    let height = navopen ? '200px' : '0px';
    navbtn.innerText = icon;
    nav.style.height = height;
  } else return;
}


document.onclick = e => closenav(e);


const handletheme = () => {
  isdarktheme = !isdarktheme;
  localStorage.setItem('table-dtheme', JSON.stringify(isdarktheme));
  settheme();
}


const handledelete = (elmnt, id) => {
  if (confirm('delete this event')) {
    updatehtml({
      type: 'DELETE_ELMNT',
      item: {},
      pos: {
        elmnt: elmnt.parentNode
      }
    });
    updatedb({
      method: 'DELETE',
      id
    });
  }
}


const handleform = (event) => {
  event.preventDefault();
  const { time = null, txt = null, status = null } = handleinput();
  if (status) {
    alert(status);
  }else {
    let id = new Date().getTime();
    if (table == null) {
      localStorage.setItem('table', JSON.stringify([]));
      table = JSON.parse(localStorage.getItem('table'));
    }
    let newitem = { time,txt,id }
    updatedb({ method: 'ADD',newitem })
    set1elmnt();
    let position = table.indexOf(newitem);
    let positem = (position == 0) ? {
      elmnt: htmltable[position],
      place: 'beforebegin'
    } : {
      elmnt: htmltable[position - 1],
      place: 'afterend'
    };
    if (htmltable.length == 0) positem = {};
    updatehtml({
      type: 'ADD_ELMNT',
      item: newitem,
      pos: positem
    })
    setTimeout(scrollelmnt, 1000);
  }
}