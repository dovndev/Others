const theme = JSON.parse(localStorage.getItem("Theme-React"));
const notFirst = JSON.parse(localStorage.getItem("notFirst"));

const App = {
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

      return navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          reg.addEventListener("updatefound", () => {
            App.newServiceWorker = reg.installing;

            App.newServiceWorker.addEventListener("statechange", (event) => {
              if (
                event.target.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                window.newServiceWorker = App.newServiceWorker;
                sendMessage({
                  action: "update-available",
                });
              }
            });
          });

          if (reg.waiting && !App.newServiceWorker) {
            App.newServiceWorker = reg.waiting;
            window.newServiceWorker = App.newServiceWorker;
            sendMessage({
              action: "update-available",
            });
          }

          navigator.serviceWorker.controller.addEventListener(
            "message",
            (event) => {
              if (event.data.action === "update") {
                App.newServiceWorker.skipWaiting();
              }
            }
          );
        })
        .catch((err) => {
          console.log("Service-Worker Not Registered, error : ", err);
        });
    }

    if (theme !== null && theme === false) {
      document.getElementById("root").classList.add("dark");
    }
  },
};

window.App = App;
