const theme = JSON.parse(localStorage.getItem("Theme-React"));
const notFirst = JSON.parse(localStorage.getItem("notFirst"));
let newServiceWorker;
localStorage.removeItem("FirstInstall");

document.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("controllerchange");
      if (notFirst) {
        if (navigator.serviceWorker.controller) window.location.reload();
      } else localStorage.setItem("notFirst", true);
    });

    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          newServiceWorker = reg.installing;

          newServiceWorker.addEventListener("statechange", (event) => {
            if (
              event.target.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              navigator.serviceWorker.controller.postMessage({
                action: "update-available",
              });
            }
          });
        });
      })
      .catch((err) => {
        console.log("Service-Worker Not Registered, error : ", err);
      });
  }

  if (theme !== null && theme === false) {
    document.getElementById("root").classList.add("dark");
  }
});
