const input = document.querySelector(".input");
const content = document.getElementById("content");
const load = document.querySelector(".load-cont");
content.style.border = 'none';

function addimg(elm) {
  const details = elm.parentNode.parentNode.lastChild;
  details.classList.add('full');
  elm.parentNode.remove();
}

const regexp = /[^\.]\.[^\.]/;

function GetPreview() {
  if (!(regexp.test(input.value))) return alert('Not A Link');
  const NewElment = document.createElement('div');
  NewElment.classList.add('linkbox');
  NewElment.innerHTML = `<img src="https://icons8.com/preloaders/preloaders/22/Fading%20circles.gif" loading="lazy"/>`;
  content.appendChild(NewElment);

  fetch(`https://api.linkpreview.net/?key=44ab599c49f52aa82bb84040cf5d3748&q=${input.value}`)
    .then(res => res.json())
    .then(json => {
      let notok = (!json.description && !json.image && !json.title);
      let url;
      console.log(json);
      if (!json.error && json.url !== "") url = new URL(json.url);
      const html = ` 
       <div class="img-cont">
        <img src="${json.image}" onerror="addimg(this)">
       </div>
       <div class="details">
        ${json.title && `<h3>${json.title}</h3>`}
        ${json.description && `<h5>${json.description}</h5>`}
        ${(json.url !== "" && url) && `<a href="${json.url}">${url && url.hostname}</a>`}
        </div>`;
      if (json.error || json.url === "" || notok) {
        alert((json.description.includes("exceeded")) ? json.description : "Cannot find any preview for the requested Link");
        NewElment.remove();
      }else {
        NewElment.style.border = '2px solid cornflowerblue';
        NewElment.innerHTML = html;
      }
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
