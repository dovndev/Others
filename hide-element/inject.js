const storeName = "hider-007";
let clickedEl = null;
let savedHider = JSON.parse(localStorage.getItem(storeName)) || [];
let hidedEl = [];
let nohider = [];

const addTohidedEl = (element) => {
  const { opacity, zIndex, pointerEvents, height } = element.style;
  const newElement = {
    element: element,
    id: element.id,
    style: { opacity, zIndex, pointerEvents, height },
  };
  hidedEl = [...hidedEl, newElement];
};

const saveHider = () => {
  if (savedHider.length === 0) localStorage.removeItem(storeName);
  else localStorage.setItem(storeName, JSON.stringify(savedHider));
};

function show({ element, id, style: { opacity, zIndex, pointerEvents, height } }) {
  element.removeAttribute("hider");
  element.id = id;
  element.style.opacity = opacity;
  element.style.zIndex = zIndex;
  element.style.pointerEvents = pointerEvents;
  element.style.height = height;
}

function hide(element) {
  element.setAttribute("hider", "hide-element");
  element.id = "hider";
  element.style.opacity = "0";
  element.style.zIndex = "-100000";
  element.style.pointerEvents = "none";
  element.style.height = "0px";
}

function undo() {
  if (hidedEl.length !== 0) {
    const lastItem = hidedEl[hidedEl.length - 1];
    show(lastItem);
    savedHider = savedHider.filter(({ id, innerText }) => {
      if (id) return lastItem.id !== id;
      else return lastItem.element.innerText !== innerText;
    });
    saveHider();
    hidedEl.pop();
  }
}

const init = (hider) => {
  const { id, tagName, innerText } = hider;
  let element;
  if (id) element = document.getElementById(id);
  else {
    [...document.querySelectorAll(tagName)]
      .filter((elm) => elm.innerText === innerText)
      .forEach((elm) => (element = elm));
  }
  if (element) {
    addTohidedEl(element);
    hide(element);
  } else {
    hider.count = hider.count ? hider.count + 1 : 1;
    if (hider.count > 10) {
      savedHider = savedHider.filter(({ id, innerText }) => {
        if (id) return hider.id !== id;
        else return hider.innerText !== innerText;
      });
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
    addTohidedEl(clickedEl);
    if (clickedEl.id && clickedEl.id !== "") {
      savedHider.push({ id: clickedEl.id });
      saveHider();
    } else if (clickedEl.innerText && clickedEl.innerText !== "") {
      savedHider.push({
        tagName: clickedEl.tagName,
        innerText: clickedEl.innerText,
      });
      saveHider();
    }
    hide(clickedEl);
  } else if (req === "show-last-hided-element") {
    undo();
  }
});
