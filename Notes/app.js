const theme = JSON.parse(localStorage.getItem("Theme-React"));
const notFirst = JSON.parse(localStorage.getItem("notFirst"));

if (theme !== null && theme === false) {
  document.getElementById("root").classList.add("dark");
}
localStorage.removeItem("FirstInstall");

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
  sendMessage: (msg, controller) => {
    if (controller) controller.postMessage(msg);
    else {
      if (window.APP.controller) {
        window.APP.controller.postMessage(msg);
      }
    }
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
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.APP.controller = navigator.serviceWorker.controller;
        if (notFirst) window.location.reload();
        else localStorage.setItem("notFirst", true);
      });

      let reg;
      try {
        reg = await navigator.serviceWorker.register("./sw.js");
      } catch (err) {
        console.error("Service-Worker Not Registered, error : ", err);
      }
      window.APP.controller = await reg.active;

      console.log(await reg);

      if (reg.waiting) {
        window.APP.newServiceWorker = await reg.waiting;
        console.log("from waiting");
        window.APP.sendMessage(
          { action: window.APP.ACTIONS.UPDATE_AVAILABLE },
          await reg.active
        );
      }

      await reg.addEventListener("updatefound", () => {
        window.APP.newServiceWorker = reg.installing;

        window.APP.newServiceWorker.addEventListener("statechange", (event) => {
          if (event.target.state === "installed" && window.APP.controller) {
            window.APP.sendMessage({
              action: window.APP.ACTIONS.UPDATE_AVAILABLE,
            });
          }
        });
      });
      return await reg.active;
    }
  },
};
