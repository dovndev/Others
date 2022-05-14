const theme = JSON.parse(localStorage.getItem("Theme-React"));

if (theme !== null && theme === false) {
  document.getElementById("root").classList.add("dark");
}
localStorage.removeItem("FirstInstall");
localStorage.removeItem("notFirst");

window.APP = {
  STORE_KEYS: {
    NOTES: "Notes-React",
    THEME: "Theme-React",
    NEWNOTE: "NewNote-React",
    ENTERSEND: "EnterSend-React",
  },
  ACTIONS: {
    RELOAD_DATA: "reload-data",
    UPDATE: "update",
    UPDATE_AVAILABLE: "update-available",
    UPDATE_FOUND: "update-found",
    REINSTALL: "reinstall",
  },
  META_LIST: [
    "theme-color",
    "msapplication-TileColor",
    "apple-mobile-web-app-status-bar",
    "msapplication-navbutton-color",
    "mask-icon",
  ],
  newServiceWorker: null,
  controller: null,
  sendMessage: (msg, controller = window.APP.controller) => {
    console.log(controller, msg);
    if (controller) controller.postMessage(msg);
  },
  copyToClipBoard: async (text) => {
    if (text && text !== "") {
      return await navigator.clipboard
        .writeText(text)
        .catch((err) => console.error("clip board error : \n", err));
    }
  },
  init: async () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", (e) => {
        console.log("controllerchange", e);
        window.APP.controller = navigator.serviceWorker.controller;
        window.location.reload();
      });

      const sendUpdate = (worker) => {
        window.APP.sendMessage(
          { action: window.APP.ACTIONS.UPDATE_AVAILABLE },
          window.APP.controller
        );
        window.APP.sendMessage(
          { action: window.APP.ACTIONS.UPDATE_FOUND },
          worker
        );
      };

      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          window.APP.controller = reg.active;

          if (reg.waiting) {
            window.APP.newServiceWorker = reg.waiting;
            sendUpdate(reg.waiting);
          }

          reg.addEventListener("updatefound", () => {
            window.APP.newServiceWorker = reg.installing;

            window.APP.newServiceWorker.addEventListener("statechange", () => {
              if (window.APP.newServiceWorker.state === "installed") {
                sendUpdate(window.APP.newServiceWorker);
              }
            });
          });
          return reg;
        })
        .catch((err) =>
          console.error("Service-Worker Not Registered, error : ", err)
        );
    }
  },
};
