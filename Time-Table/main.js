const cont = document.querySelector(".cont");
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
            <p class="time"><span>${item.time}</span></p>
            <p class="event"><span>${item.event}</span></p>
          </div>
          `
    } else {
      html +=
        `<div class="container">
            <p class="time"><span>${item.time}</span></p>
            <p class="event"><span>${item.event}</span></p>
          </div>
          <h1>&#8595;</h1>
          `
    }
  })
  console.log(html);
  cont.innerHTML = html;
}
start();