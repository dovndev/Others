const contextMenuItem1 = {
  id: "hide-element",
  title: "Hide element",
  contexts: ["all"],
};

const contextMenuItem2 = {
  id: "undu",
  title: "Show last hided element",
  contexts: ["all"],
};

chrome.contextMenus.create(contextMenuItem1);
//chrome.contextMenus.create(contextMenuItem2);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === contextMenuItem1.id) {
    chrome.tabs.sendMessage(tab.id, contextMenuItem1.id);
  } else if (info.menuItemId === contextMenuItem2.id) {
    chrome.tabs.sendMessage(tab.id, contextMenuItem2.id);
  }
});
