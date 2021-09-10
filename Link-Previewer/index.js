const input = document.querySelector(".input");
const content = document.getElementById("content");
const load = document.querySelector(".load-cont");
content.style.border = 'none';

function addimg(elm) {
  let src = 'https://imgr.search.brave.com/-YVe2niUXNLkAKFAyc-FcqZsIb04M3XjxtWcfmcmuK4/fit/1200/1080/ce/1/aHR0cHM6Ly93d3cu/ZHJvZGQuY29tL2lt/YWdlczE0L3doaXRl/Ny5qcGc';
  if (elm.src !== src) elm.src = src;
}

function GetPreview() {
  const NewElment = document.createElement('div');
  NewElment.classList.add('linkbox');
  NewElment.innerHTML = `<img src="https://icons8.com/preloaders/preloaders/22/Fading%20circles.gif" loading="lazy"/>`;
  content.appendChild(NewElment);

  fetch(`https://api.linkpreview.net/?key=44ab599c49f52aa82bb84040cf5d3748&q=${input.value}`)
    .then(res => res.json())
    .then(json => {
      const url = new URL(json.url);
      const html = ` 
       <div class="img-cont">
        <img src="${json.image}" onerror="addimg(this)">
       </div>
       <div class="details">
        <h3>${json.title}</h3>
        <h5>${json.description}</h5>
        <a href="${json.url}">${url.hostname}</a>
        </div>`;
      
      NewElment.style.border = '2px solid cornflowerblue';
      NewElment.innerHTML = html;
      console.log(json.image)
    });
}

document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
});


//     fetch(`https://proclink.p.rapidapi.com/oembed?url=${value}`, {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "proclink.p.rapidapi.com",
// 		"x-rapidapi-key": "undefined"
// 	}
// })
// .then(response => {
// 	console.log(response);
// })
// .catch(err => {
// 	console.error(err);
// });
