const signup = document.getElementById("toSignup");
const signin = document.getElementById("toSignin");

const toggleLogin = () => {
  document.getElementById("signin").classList.toggle("hide");
  document.getElementById("signup").classList.toggle("hide");
};

signin.addEventListener("click", toggleLogin);
signup.addEventListener("click", toggleLogin);

document.getElementById("submit-signin").addEventListener("click", (e) => {
  console.log("Fetching data");
  localStorage.setItem("user", document.getElementById("signin-name").value);
  localStorage.setItem(
    "passwd",
    document.getElementById("signin-passwd").value
  );
  var http = new XMLHttpRequest();
  http.open(
    "POST",
    "https://multiplayer-js-default-rtdb.firebaseio.com/users.json",
    true
  );
  http.setRequestHeader("data", {
    name: document.getElementById("signin-name").value,
    passwd: document.getElementById("signin-passwd").value,
  });
  http.send();
});
document.getElementById("submit-signup").addEventListener("click", (e) => {
  console.log("Fetching data");
});

const reg = document.getElementsByClassName("redirect-back");
[...reg].forEach((ele) =>
  ele.addEventListener("click", () => {
    window.history.back();
  })
);
