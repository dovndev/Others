const theme = JSON.parse(localStorage.getItem("Theme-React"));
const notFirst = JSON.parse(localStorage.getItem("notFirst"));
localStorage.removeItem("FirstInstall");
let newWorker;

document.addEventListener("DOMContentLoaded", () => {
  const messageChannel = new MessageChannel();
  messageChannel.port1.addEventListener("message", (event) => {
    console.log(event);
  });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("controllerchange");
      if (notFirst) {
        window.location.reload();
      } else localStorage.setItem("notFirst", true);
    });

    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          newWorker = reg.installing;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              window.newWorker = newWorker;
              window.setUpdateAvailable();
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
