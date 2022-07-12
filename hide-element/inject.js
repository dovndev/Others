const storeName = "hider-12222312313123";
const hiderClass = "__web-inspector-hide-shortcut__";
let clickedEl = null;
let savedHider = JSON.parse(localStorage.getItem(storeName)) || [];
let hidedEl = [];
let nohider = [];

const saveHider = () => {
  if (savedHider.length === 0) localStorage.removeItem(storeName);
  else localStorage.setItem(storeName, JSON.stringify(savedHider));
};

function show(element) {
  element.classList.remove(hiderClass);
}

function hide(element) {
  element.classList.add(hiderClass);
}

function undo() {
  if (hidedEl.length !== 0) {
    show(hidedEl[hidedEl.length - 1]);
    savedHider.pop();
    saveHider();
    hidedEl.pop();
  }
}

const init = (hider, index) => {
  const { id, tagName, innerText, no_data } = hider;
  let element;
  if (id) element = document.getElementById(id);
  else if (innerText) {
    [...document.querySelectorAll(tagName)]
      .filter((elm) => elm.innerText === innerText)
      .forEach((elm) => (element = elm));
  } else if (no_data) {
    savedHider = savedHider.filter((e, i) => i !== index);
    saveHider();
    return;
  }
  if (element) {
    hidedEl.push(element);
    hide(element);
  } else {
    hider.count = hider.count ? hider.count + 1 : 1;
    if (hider.count > 10) {
      savedHider = savedHider.filter((e, i) => i !== index);
      saveHider();
    } else {
      setTimeout(() => init(hider), 500 * hider.count);
    }
  }
};

savedHider.forEach(init);

document.addEventListener("contextmenu", (e) => (clickedEl = e.target), true);

document.addEventListener("keydown", (e) => {
  const { tagName, contentEditable } = document.activeElement;
  if (
    e.ctrlKey &&
    e.key === "z" &&
    tagName !== "INPUT" &&
    tagName !== "TEXTAREA" &&
    contentEditable !== "true"
  )
    undo();
});

chrome.runtime.onMessage.addListener((req) => {
  if (req === "hide-element") {
    hide(clickedEl);
    hidedEl.push(clickedEl);
    if (clickedEl.id && clickedEl.id !== "") {
      savedHider.push({ id: clickedEl.id });
      saveHider();
    } else if (clickedEl.innerText && clickedEl.innerText !== "") {
      savedHider.push({
        tagName: clickedEl.tagName,
        innerText: clickedEl.innerText,
      });
      saveHider();
    } else {
      savedHider.push({
        no_data: true,
      });
      saveHider();
    }
  } else if (req === "undo") undo();
});
