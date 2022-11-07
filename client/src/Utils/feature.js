const mic = document.getElementById("mic");
const video = document.getElementById("video");

mic.addEventListener("click", () => {
  mic.classList.toggle("mute");
  mic.classList.toggle("talk");
});

video.addEventListener('click', () => {
  window.open("./lobby.html")
})