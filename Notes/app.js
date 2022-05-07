const theme = JSON.parse(localStorage.getItem("Theme-React"));
const firstInstall = JSON.parse(localStorage.getItem("FirstInstall"));
const reloadConfirm = `New update have been installed.
let's Activate the update by reloading the page`;

document.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (firstInstall === null) {
        localStorage.setItem("FirstInstall", false);
      }

      if (firstInstall === false) {
        if (confirm(reloadConfirm)) window.location.reload();
      }
    });

    navigator.serviceWorker.register("./sw.js").catch((err) => {
      console.log("Service-Worker Not Registered, error : ", err);
    });
  }

  if (theme !== null && theme === false) {
    document.getElementById("root").classList.add("dark");
  }
});
