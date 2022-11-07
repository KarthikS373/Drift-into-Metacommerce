const APP_ID = "d2e59122cc77491ab188b0ef9a247e41";

const generateUid = () => {
  const uid = String(Math.floor(Math.random() * 10000 + Math.random() * 10000));
  sessionStorage.setItem("uid", uid);
  return uid;
};

const uid = sessionStorage.getItem("uid") || generateUid();
const token = null;

let client;
let channel;
let rtmClient;

let roomId = new URLSearchParams(window.location.search).get("room");
const displayName =
  new URLSearchParams(window.location.search).get("user") || "user";

if (!roomId) {
  console.warn("No room id set Redirecting to main meeting...");
  roomId = "main";
}
document.getElementById("current__room").innerText = roomId;

let localTracks = [];
let remoteUsers = {};

//! Joining the room
const joinRoom = async () => {
  rtmClient = await AgoraRTM.createInstance(APP_ID);
  await rtmClient.login({ uid, token });

  await rtmClient.addOrUpdateLocalUserAttributes({
    name: displayName,
  });

  channel = await rtmClient.createChannel(roomId);
  await channel.join();

  channel.on("MemberJoined", handleMemberJoin);
  channel.on("MemberLeft", handleMemberLeft);
  channel.on("ChannelMessage", handleChannelMessage);

  getMembers();
  addBotMessage(`Welcome to the room ${displayName} 👋`);

  client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  await client.join(APP_ID, roomId, token, uid);

  joinStream();

  client.on("user-published", handleUserPublish);
  client.on("user-left", handleLeftUser);
};

const joinStream = async () => {
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks({}, {}); // First parameter is for audio settings and second for video config

  const video = `<div class="video__container" id="user-container-${uid}"><div class="video-player" id="user-${uid}"></div></div>`;

  document
    .getElementById("streams__container")
    .insertAdjacentHTML("beforeend", video);

  document
    .getElementById(`user-container-${uid}`)
    .addEventListener("click", expandFrame);

  // localTracks[0] = audio and localTracks[1] = video
  localTracks.forEach((track) => track.stop());
  localTracks[1].play(`user-${uid}`);

  await client.publish([localTracks[0], localTracks[1]]);
};

//! Handlers
const handleUserPublish = async (user, mediaType) => {
  remoteUsers[user.uid] = user;

  await client.subscribe(user, mediaType);

  let video = document.getElementById(`user-container-${user.uid}`);
  console.log(video);
  if (video == null) {
    video = `<div class="video__container" id="user-container-${user.uid}"><div class="video-player" id="user-${user.uid}"></div></div>`;
  }
  document
    .getElementById("streams__container")
    .insertAdjacentHTML("beforeend", video);

  document
    .getElementById(`user-container-${user.uid}`)
    .addEventListener("click", expandFrame);

  if (displayFrame.style.display) {
    let videoFrame = document.getElementById(`user-container-${user.uid}`);
    videoFrame.style.height = "100px";
    videoFrame.style.width = "100px";
  }

  if (mediaType == "video") {
    user.videoTrack.play(`user-${user.uid}`);
  }
  if (mediaType == "audio") {
    user.audioTrack.play();
  }
};

const handleLeftUser = async (user) => {
  delete remoteUsers[user.uid];
  document.getElementById(`user-container-${user.uid}`).remove();

  if (currentUserInDisplay == `user-container-${user.uid}`) {
    displayFrame.style.display = null;

    let videoFrames = document.getElementsByClassName("video__container");
    for (let i = 0; i < videoFrames.length; ++i) {
      videoFrames[i].style.height = "300px";
      videoFrames[i].style.width = "300px";
    }
  }
};

//! Controllers for camera and audio
const toggleCamera = async (e) => {
  let btn = e.currentTarget;
  if (localTracks[1].muted) {
    await localTracks[1].setMuted(false);
    btn.classList.add("active");
  } else {
    await localTracks[1].setMuted(true);
    btn.classList.remove("active");
  }
};
document.getElementById("camera-btn").addEventListener("click", toggleCamera);

const toggleMic = async (e) => {
  let btn = e.currentTarget;
  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    btn.classList.add("active");
  } else {
    await localTracks[0].setMuted(true);
    btn.classList.remove("active");
  }
};
document.getElementById("mic-btn").addEventListener("click", toggleMic);

joinRoom();

document.querySelector("#leave-btn").addEventListener("click", (e) => {
  window.close();
});
