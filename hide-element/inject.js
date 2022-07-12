const storeName = "hider-12222312313123";
const hiderClass = "__web-inspector-hide-shortcut__";
let clickedElm = null;
let savedHider = JSON.parse(localStorage.getItem(storeName)) || [];
let hidedElms = [];
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
  if (hidedElms.length !== 0) {
    show(hidedElms[hidedElms.length - 1]);
    hidedElms.pop();
    savedHider.pop();
    saveHider();
  }
}

const init = (hider, index) => {
  const { id, tagName, innerText } = hider;
  let element = undefined;
  if (id) element = document.getElementById(id) || undefined;
  else if (innerText) {
    element =
      [...document.querySelectorAll(tagName)].filter(
        (elm) => elm.innerText === innerText
      )[0] || undefined;
  } else element = null;
  if (element) {
    hidedElms.push(element);
    hide(element);
  } else {
    if (element === undefined) {
      hider.count = hider.count ? hider.count + 1 : 1;
      if (hider.count > 10) {
        savedHider = savedHider.filter((e, i) => i !== index);
        saveHider();
      } else {
        setTimeout(() => init(hider, index), 500 * hider.count);
      }
    } else if (element === null) {
      savedHider = savedHider.filter((e, i) => i !== index);
      saveHider();
    }
  }
};

savedHider.forEach(init);

document.addEventListener("contextmenu", (e) => (clickedElm = e.target), true);

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
    hide(clickedElm);
    hidedElms.push(clickedElm);
    if (clickedElm.id && clickedElm.id !== "") {
      savedHider.push({ id: clickedElm.id });
      saveHider();
    } else if (clickedElm.innerText && clickedElm.innerText !== "") {
      savedHider.push({
        tagName: clickedElm.tagName,
        innerText: clickedElm.innerText,
      });
      saveHider();
    } else {
      savedHider.push({});
      saveHider();
    }
  } else if (req === "undo") undo();
});
