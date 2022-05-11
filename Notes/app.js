const theme = JSON.parse(localStorage.getItem("Theme-React"));
const notFirst = JSON.parse(localStorage.getItem("notFirst"));

const APP = {
  newServiceWorker: null,
  controller: null,
  sendMessage: (msg) => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(msg);
    }
  },
  init: async () => {
    localStorage.removeItem("FirstInstall");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (notFirst) {
          window.location.reload();
        } else localStorage.setItem("notFirst", true);
      });

      await navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          reg.addEventListener("updatefound", () => {
            APP.newServiceWorker = reg.installing;

            APP.newServiceWorker.addEventListener("statechange", (event) => {
              if (
                event.target.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                window.newServiceWorker = APP.newServiceWorker;
                sendMessage({
                  action: "update-available",
                });
              }
            });
          });

          if (reg.waiting && !APP.newServiceWorker) {
            APP.newServiceWorker = reg.waiting;
            window.newServiceWorker = APP.newServiceWorker;
            sendMessage({
              action: "update-available",
            });
          }
        })
        .catch((err) => {
          console.log("Service-Worker Not Registered, error : ", err);
        });

      return navigator.serviceWorker.controller.addEventListener(
        "message",
        (event) => {
          if (event.data.action === "update") {
            APP.newServiceWorker.skipWaiting();
          }
        }
      );
    }

    if (theme !== null && theme === false) {
      document.getElementById("root").classList.add("dark");
    }
  },
};

window.APP = APP;
