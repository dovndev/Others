let botON = false;
let chatOpen;
let chatInput;
let sendBtn;
let sidebar;
let participants;
let participantsList;
let messageList;
const commands = `"reply[message]": [message],
"info[name]": [name]'s info, 
"time": time,
"about": about chat-bot,
"help": help`;
const help = `Everything inside square brackets [] is expected input and cannot be empty.
All unrecognized commands will be given a random reply.`;
const welcomeMsg = `Available commands : )

${commands}

${help}
Enjoy ❤️`;
const about = `Google Meet chat-bot extension : )

version: 3.1,
developer: hidden`;

Array.prototype.random = function () {
  return this[Math.round(Math.random() * (this.length - 1))];
};

const escapeHTMLPolicy = trustedTypes.createPolicy("myEscapePolicy", {
  createHTML: (string) => string,
});

function openChat() {
  if (sidebar.classList.contains("qdulke")) {
    chatOpen.click();
  }
  messageList.scrollTop = messageList.scrollHeight;
}
function sendMessage(message) {
  chatInput.value = message;
  sendBtn.removeAttribute("disabled");
  sendBtn.click();
}

function createMessage(name, time) {
  return [
    `Hey ${name} got your message at ${time}`,
    `Hello ${name} your message was recived at ${time}`,
    `Hey ${name} thank you for the message`,
    `Hey ${name} we are processing your message... this might take a day`,
    `Hey ${name} its now ${time} and i got your message`,
    `Hello ${name} how are you`,
  ].random();
}

const init3 = async () => {
  participantsList = document.querySelector("[aria-label='Participants']");
  if (participantsList === null) {
    console.log("chat-bot loading 4");
    setTimeout(init3, 500);
    return;
  }
  console.log("chat-bot loading complete");

  function updateUsers() {
    participants = Array.from(participantsList.children).map((i) => {
      return {
        name: i.children[0].children[1].children[0].children[0].textContent,
        profile: i.children[0].children[0].children[0].src.replace(
          "s192",
          "s700"
        ),
        host: i.children[0].children[1].children[1] !== undefined,
      };
    });
  }
  const mutationObserver2 = new MutationObserver(updateUsers);
  mutationObserver2.observe(participantsList, { childList: true });
  updateUsers();
  openChat();
};

const init2 = async () => {
  if (document.querySelector(".vvTMTb") === null) {
    console.log("chat-bot loading 1");
    setTimeout(init2, 500);
    return;
  }

  if (document.querySelector(".v8W0vf") === null) {
    console.log("chat-bot loading 2");
    setTimeout(init2, 500);
    return;
  }

  if (document.querySelector("[aria-live='polite']") === null) {
    console.log("chat-bot loading 3");
    setTimeout(init2, 500);
    return;
  }

  //Everything loaded
  messageList = document.querySelector("[aria-live='polite']");
  sidebar = document.querySelector(".WUFI9b");
  chatInput = document.querySelector(
    "[aria-label='Send a message to everyone']"
  );
  sendBtn = document.querySelector(
    ".VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.tWDL4c.Cs0vCd"
  );
  messageList.style.scrollBehaviour = "smooth";
  if (!(sidebar && chatInput && sendBtn)) {
    alert("some elements are missing check chat bot code and fix the error");
    return;
  }
  //all elements are available

  const Startbtn = document.createElement("button");
  Startbtn.innerHTML = escapeHTMLPolicy.createHTML(`
  <span>Enable automated chat bot</span>
  <button>
   <div class="ball">
    <svg class="tick" viewBox="0 0 24 24" fill="white">
     <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"></path>
    </svg>
    <svg class="minus" viewBox="0 0 24 24"  fill="white">
     <path d="M20 13H4v-2h16v2z"></path>
    </svg>
   </div>
  </button>`);
  Startbtn.classList.add("start-btn");
  // document.body.appendChild(Startbtn);

  Startbtn.addEventListener("click", () => {
    if (botON == false) {
      if (!confirm("Are you sure you want to Enable Chat Bot")) return;
      botON = true;
      sendMessage("Initialised Chat Bot");
      sendMessage(welcomeMsg);
      Startbtn.classList.add("on");
    } else {
      botON = false;
      sendMessage("Chat Bot - turned off");
      Startbtn.classList.remove("on");
    }
  });

  mutationObserver = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      if (botON) {
        const { children } = entry.addedNodes[0];
        const sender = children[0].children[0].textContent;
        if (sender === "You") return;
        const message = children[1].children[0].textContent.trim();
        if (message.toLowerCase() === "time") {
          const now = document.querySelector(
            ".MQKmmc.SudKRc.Q4etDd.wYNW7d"
          ).textContent;
          sendMessage(`${now.slice(0, -2)} ${now.slice(-2)}`);
        } else if (message.toLowerCase() === "about") {
          sendMessage(about);
        } else if (message.toLowerCase() === "help") {
          sendMessage(`${commands}

${help}`);
        } else if (/^reply\[.*]$/gi.test(message)) {
          sendMessage(`Reply to ${sender} : ${message.slice(6, -1)}`);
        } else if (/^info\[.*]$/gi.test(message)) {
          const inputName = message.slice(5, -1).trim();
          const participant = participants.find((i) => {
            return i.name.trim().toLowerCase() === inputName.toLowerCase();
          });

          if (participant) {
            sendMessage(`name: ${participant.name},
profile: ${participant.profile},
host: ${participant.host.toString()}`);
          } else {
            sendMessage(
              `No participant with name "${inputName}". Check name and try again`
            );
          }
        } else {
          const time = children[0].children[1].textContent;
          sendMessage(createMessage(sender, time));
        }
      }
    });
    openChat();
  });

  mutationObserver.observe(messageList, {
    childList: true,
  });

  document
    .querySelector(".vvTMTb")
    .insertBefore(Startbtn, document.querySelector(".v8W0vf"));
  document.querySelector(".v8W0vf").remove();
  document.querySelector("[aria-label='Show everyone']").click();
  init3();
};

const init = async () => {
  chatOpen = document.querySelector("[aria-label='Chat with everyone']");
  if (chatOpen === null) {
    console.log("chat-bot loading 0");
    setTimeout(init, 500);
    return;
  }
  chatOpen.click();
  init2();
};

init();
