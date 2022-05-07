let clickedEl = null;
let hidedEl = [];

document.addEventListener("contextmenu", (e) => (clickedEl = e.target), true);

function undo() {
  if (hidedEl.length !== 0) {
    hidedEl[hidedEl.length - 1].setAttribute("hider", "show-element");
    hidedEl.pop();
  }
}

document.addEventListener("keydown", (e) => {
  if (
    e.ctrlKey &&
    e.key === "z" &&
    document.activeElement.tagName !== "INPUT" &&
    document.activeElement.tagName !== "TEXTAREA" &&
    document.activeElement.contentEditable !== "true"
  )
    undo();
});

chrome.runtime.onMessage.addListener((req) => {
  if (req === "hide-element") {
    if (clickedEl.hider !== "hide-element") {
      clickedEl.setAttribute("hider", "hide-element");
      hidedEl.push(clickedEl);
    }
  } else if (req === "show-last-hided-element") {
    undo();
  }
});
