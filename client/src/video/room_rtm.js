const handleMemberJoin = async (id) => {
  const { name } = await rtmClient.getUserAttributesByKeys(id, ["name"]);

  console.log(id + "joined the chats");
  addMemberToChats(id);

  let members = await channel.getMembers();
  updateMemberCount(members);

  addBotMessage(`Welcome to the room ${name} 👋`);
};

const handleMemberLeft = async (id) => {
  removeMemberFromChats(id);
  let members = await channel.getMembers();
  updateMemberCount(members);
};

const handleChannelMessage = async (data, id) => {
  data = JSON.parse(data.text);

  if (data.type == "chat") {
    addMessage(data.displayName, data.message);
  }
};

const leaveChannel = async () => {
  await channel.leave();
  await rtmClient.logout();
};

const getMembers = async () => {
  let members = await channel.getMembers();
  for (let member of members) {
    addMemberToChats(member);
  }
};

//! utils
const addMemberToChats = async (id) => {
  const { name } = await rtmClient.getUserAttributesByKeys(id, ["name"]);

  const wrapper = document.getElementById("member__list");
  const item = `<div class="member__wrapper" id="member__${id}__wrapper"><span class="green__icon"></span><p class="member_name">${name}</p></div>`;
  wrapper.insertAdjacentHTML("beforeend", item);
};

const removeMemberFromChats = async (id) => {
  let member = document.getElementById(`member__${id}__wrapper`);
  member.remove();

  const name = member.getElementsByClassName("member_name")[0].textContent;
  addBotMessage(`${name} has left the room!!`);
};

const updateMemberCount = async (members) => {
  // const totalCount = document.getElementById("members__count");
  // totalCount.innerText = members.length;
};

const addMessage = async (name, message) => {
  const wrapper = document.getElementById("messages");
  const item = ` <div class="message__wrapper"><div class="message__body"><strong class="message__author">${name}</strong><p class="message__text">${message}</p></div></div>`;

  wrapper.insertAdjacentHTML("beforeend", item);

  const newMessage = document.querySelector(
    "#messages .message__wrapper:last-child"
  );
  newMessage.scrollIntoView();
};

addBotMessage = async (message) => {
  const wrapper = document.getElementById("messages");
  const item = `<div class="message__wrapper"><div class="message__body__bot"><strong class="message__author__bot">🤖 Bot</strong><p class="message__text__bot">${message}</p></div></div>`;
  wrapper.insertAdjacentHTML("beforeend", item);
};

//! Sending messages
const sendMessage = async (e) => {
  e.preventDefault();
  let message = e.target.message.value;
  channel.sendMessage({
    text: JSON.stringify({
      type: "chat",
      message: message,
      displayName: displayName,
    }),
  });

  addMessage(displayName, message);

  e.target.reset();
};

//! Events to DOM
window.addEventListener("beforeunload", leaveChannel);

const messageForm = document.getElementById("message__form");
messageForm.addEventListener("submit", sendMessage);
