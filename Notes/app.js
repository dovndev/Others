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
        APP.controller = navigator.serviceWorker.controller;
        if (notFirst) {
          if (APP.controller) window.location.reload();
        } else localStorage.setItem("notFirst", true);
      });
      const reg = await navigator.serviceWorker.register("./sw.js");
      try {
        reg.addEventListener("updatefound", () => {
          APP.newServiceWorker = reg.installing;

          APP.newServiceWorker.addEventListener("statechange", (event) => {
            if (event.target.state === "installed" && APP.controller) {
              window.newServiceWorker = APP.newServiceWorker;
              APP.sendMessage({
                action: "update-available",
              });
            }
          });
        });

        if (reg.waiting && !APP.newServiceWorker) {
          APP.newServiceWorker = reg.waiting;
          window.newServiceWorker = APP.newServiceWorker;
          APP.sendMessage({
            action: "update-available",
          });
        }
        return reg.active;
      } catch (err) {
        console.log("Service-Worker Not Registered, error : ", err);
      }
    }

    if (theme !== null && theme === false) {
      document.getElementById("root").classList.add("dark");
    }
  },
};

window.APP = APP;
