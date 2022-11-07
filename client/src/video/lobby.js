const USER = localStorage.getItem('user');

const togglebtn = document.getElementById("create__room__btn");
let mode = "room";
togglebtn.addEventListener("click", (e) => {
  if (mode == "room") {
    document.getElementById("room__lobby__container").style.display = "block";
    document.getElementById("room__lobby-container").style.display = "none";
    mode = "join";
    togglebtn.innerText = "Join Existing";
  } else {
    document.getElementById("room__lobby__container").style.display = "none";
    document.getElementById("room__lobby-container").style.display = "grid";
    mode = "room";
    togglebtn.innerText = "Custom Room";
  }
});

const form = document.getElementById("lobby__form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let code = e.target.room.value;
  if (!code) {
    code = String(Math.floor(Math.random() * 10000));
  }

  window.location = `room.html?room=${code}&user=${USER}`;
});

const holders = document.querySelectorAll(".room__lobby-holders");
for (let holder of holders) {
  holder.addEventListener("click", () => {
    const attrib = holder.getAttribute("data-room");
    window.location = `room.html?room=${attrib}&user=${USER}`;
  });
}
