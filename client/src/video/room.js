const USER = localStorage.getItem("user");
if (!new URLSearchParams(window.location.search).get("room")) {
  window.location = `room.html?room=General&user=${USER}`;
}

let messagesContainer = document.getElementById("messages");
messagesContainer.scrollTop = messagesContainer.scrollHeight;

const memberContainer = document.getElementById("members__container");
const memberButton = document.getElementById("members__button");

const chatContainer = document.getElementById("messages__container");
const chatButton = document.getElementById("chat__button");

let activeMemberContainer = false;

memberButton.addEventListener("click", () => {
  if (activeMemberContainer) {
    memberContainer.style.display = "none";
  } else {
    memberContainer.style.display = "block";
  }

  activeMemberContainer = !activeMemberContainer;
});

let activeChatContainer = false;

chatButton.addEventListener("click", () => {
  if (activeChatContainer) {
    chatContainer.style.display = "none";
  } else {
    chatContainer.style.display = "block";
  }

  activeChatContainer = !activeChatContainer;
});

let displayFrame = document.getElementById("stream__box");
let videoFrame = document.getElementsByClassName("video__container");
let currentUserInDisplay = null;

const expandFrame = (e) => {
  let child = displayFrame.children[0];
  if (child) {
    document.getElementById("streams__container").appendChild(child);
  }
  displayFrame.style.display = "block";
  displayFrame.appendChild(e.currentTarget);
  currentUserInDisplay = e.currentTarget.id;

  for (let players of videoFrame) {
    if (players.id != currentUserInDisplay) {
      players.style.height = "100px";
      players.style.width = "100px";
    }
  }
};

for (let players of videoFrame) {
  players.addEventListener("click", expandFrame);
}

const hideDisplayFrame = () => {
  currentUserInDisplay = null;
  // displayFrame.style.display = "none";
  displayFrame.style.display = null;

  let child = displayFrame.children[0];
  document.getElementById("streams__container").appendChild(child);

  for (let players of videoFrame) {
    players.style.height = "300px";
    players.style.width = "300px";
  }
};

displayFrame.addEventListener("dblclick", hideDisplayFrame);
