const input = document.querySelector(".input");
const content = document.getElementById("content");
const load = document.querySelector(".load-cont");
content.style.border = 'none';

function GetPreview() {
  content.innerHTML = `<img src="https://icons8.com/preloaders/preloaders/22/Fading%20circles.gif" loading="lazy"/>`;
  const value = input.value;
  const url = new URL(
    `https://api.linkpreview.net/?key=44ab599c49f52aa82bb84040cf5d3748&q=${value}`
  );

  fetch(url.href)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      const html = ` 
       <div class="img-cont">
        <img src="${json.image}">
       </div>
       <div class="details">
        <h2>${json.title}</h2>
        </br>
        <h4>${json.description}</h4>
        </br>
        Link: <a href="${json.url}">${json.url}</a>
        </div>`;

      content.style.border = '2px solid cornflowerblue';
      content.innerHTML = html;
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
