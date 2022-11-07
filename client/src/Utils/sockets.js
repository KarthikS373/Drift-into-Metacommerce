// import Npc from "../character/Npc.js";
// import scene from "../env/Scene.js";

import eventEmitter from "../env/EventEmitter.js";

// (() => {
//   const userName = localStorage.getItem("user") || "User";

//   console.log("Socket connection established");

//   let playerId;
//   let playerRef;

//   const init = () => {
//     const refs = firebase.database().ref(`players`);
//     refs.on("value", (snapshot) => {
//       users = snapshot.val();
//       console.log(users);
//       Object.keys(users).forEach((key) => {
//         console.log(key);
//       });
//     });

//     refs.on("child_added", (snapshot) => {
//       const newUser = snapshot.val();
//       console.log(newUser);
//       if (newUser.id != playerId) {
//         console.log("New User added");
//         console.log(newUser);
// Npc.then((npc) => {
//   console.log("NPC");
//   npc.position.set(36, 0.01, 16);
//   npc.rotation.y = -(Math.PI * 0.5);
//   const coord = {
//     name: "NPC",
//     x: 36,
//     y: 0,
//     z: 16,
//   };
//   scene.add(npc);
// });
//       }
//     });
//   };

//   firebase.auth().onAuthStateChanged((user) => {
//     console.log(user);
//     if (user) {
//       playerId = user.uid;
//       playerRef = firebase.database().ref(`players/${playerId}`);

//       playerRef.set({
//         id: playerId,
//         name: userName,
//         avatar: "Ami",
//         x: 0,
//         y: 0,
//         z: 0,
//       });

//       playerRef.onDisconnect().remove();

//       init();
//     } else {
//       //logged out.
//     }
//   });

//   firebase
//     .auth()
//     .signInAnonymously()
//     .then(() => {
//       console.log("Connected to DB");
//     })
//     .catch((error) => {
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       // ...
//       console.log(errorCode, errorMessage);
//     });
// })();

//! Trying out code

let playerRef;
let playerId;
(function () {
  let players = {};
  let playerElements = {};
  // let coins = {};
  // let coinElements = {};

  // const gameContainer = document.querySelector(".game-container");
  // const playerNameInput = document.querySelector("#player-name");
  // const playerColorButton = document.querySelector("#player-color");

  // function placeCoin() {
  //   const { x, y } = getRandomSafeSpot();
  //   const coinRef = firebase.database().ref(`coins/${getKeyString(x, y)}`);
  //   coinRef.set({
  //     x,
  //     y,
  //   });

  //   const coinTimeouts = [2000, 3000, 4000, 5000];
  //   setTimeout(() => {
  //     placeCoin();
  //   }, randomFromArray(coinTimeouts));
  // }

  // function attemptGrabCoin(x, y) {
  //   const key = getKeyString(x, y);
  //   if (coins[key]) {
  //     // Remove this key from data, then uptick Player's coin count
  //     firebase.database().ref(`coins/${key}`).remove();
  //     playerRef.update({
  //       coins: players[playerId].coins + 1,
  //     });
  //   }
  // }

  // function handleArrowPress(xChange = 0, yChange = 0) {
  //   const newX = players[playerId].x + xChange;
  //   const newY = players[playerId].y + yChange;
  //   if (!isSolid(newX, newY)) {
  //     //move to the next space
  //     players[playerId].x = newX;
  //     players[playerId].y = newY;
  //     if (xChange === 1) {
  //       players[playerId].direction = "right";
  //     }
  //     if (xChange === -1) {
  //       players[playerId].direction = "left";
  //     }
  //     playerRef.set(players[playerId]);
  //     // attemptGrabCoin(newX, newY);
  //   }
  // }

  function initGame() {
    // new KeyPressListener("ArrowUp", () => handleArrowPress(0, -1));
    // new KeyPressListener("ArrowDown", () => handleArrowPress(0, 1));
    // new KeyPressListener("ArrowLeft", () => handleArrowPress(-1, 0));
    // new KeyPressListener("ArrowRight", () => handleArrowPress(1, 0));

    const allPlayersRef = firebase.database().ref(`players`);
    // const allCoinsRef = firebase.database().ref(`coins`);

    allPlayersRef.on("value", (snapshot) => {
      console.log("change occured");

      //!Fires whenever a change occurs
      players = snapshot.val() || {};

      eventEmitter.subscribe("position_change", (position) => {
        console.log(players);
        players[playerId].x = position.x;
        players[playerId].y = position.y;
        players[playerId].z = position.z;
        playerRef.set(players[playerId]);
      });

      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        let el = playerElements[key];
        if (playerId != key) {
          eventEmitter.dispatch("coord", { playerId, characterState });
        }
        //! Now update the DOM
        // eventEmitter.dispatch("coord", snapshot.val());
        // el.querySelector(".Character_name").innerText = characterState.name;
        // el.querySelector(".Character_coins").innerText = characterState.coins;
        // el.setAttribute("data-color", characterState.color);
        // el.setAttribute("data-direction", characterState.direction);
        // const left = 16 * characterState.x + "px";
        // const top = 16 * characterState.y - 4 + "px";
        // el.style.transform = `translate3d(${left}, ${top}, 0)`;
      });
    });
    allPlayersRef.on("child_added", (snapshot) => {
      //!Fires whenever a new node is added the tree
      const addedPlayer = snapshot.val();

      eventEmitter.dispatch("child_added", { addedPlayer, playerId });
      // const characterElement = document.createElement("div");
      // characterElement.classList.add("Character", "grid-cell");
      if (addedPlayer.id != playerId) {
        //! This is not you
        eventEmitter.dispatch("start_npc", { addedPlayer, playerId });
        // characterElement.classList.add("you");
      }
      // characterElement.innerHTML = `
      //   <div class="Character_shadow grid-cell"></div>
      //   <div class="Character_sprite grid-cell"></div>
      //   <div class="Character_name-container">
      //     <span class="Character_name"></span>
      //     <span class="Character_coins">0</span>
      //   </div>
      //   <div class="Character_you-arrow"></div>
      // `;
      // playerElements[addedPlayer.id] = characterElement;

      //!Fill in some initial state
      // characterElement.querySelector(".Character_name").innerText =
      //   addedPlayer.name;
      // characterElement.querySelector(".Character_coins").innerText =
      //   addedPlayer.coins;
      // characterElement.setAttribute("data-color", addedPlayer.color);
      // characterElement.setAttribute("data-direction", addedPlayer.direction);
      // const left = 16 * addedPlayer.x + "px";
      // const top = 16 * addedPlayer.y - 4 + "px";
      // characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
      // gameContainer.appendChild(characterElement);
    });

    //!Remove character DOM element after they leave
    allPlayersRef.on("child_removed", (snapshot) => {
      const removedKey = snapshot.val().id;
      eventEmitter.dispatch("child_removed", { removedKey, playerId });
      eventEmitter.dispatch("stop_npc", removedKey);
      // gameContainer.removeChild(playerElements[removedKey]);
      // delete playerElements[removedKey];
    });

    // //Updates player name with text input
    // playerNameInput.addEventListener("change", (e) => {
    //   const newName = e.target.value || createName();
    //   playerNameInput.value = newName;
    // playerRef.update({
    //   name: newName,
    // });
    // });

    // //Update player color on button click
    // playerColorButton.addEventListener("click", () => {
    //   const mySkinIndex = playerColors.indexOf(players[playerId].color);
    //   const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
    //   playerRef.update({
    //     color: nextColor,
    //   });
    // });
  }

  firebase.auth().onAuthStateChanged((user) => {
    console.log(user);
    if (user) {
      //!You're logged in!
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      // const name = createName();
      const name = "Test Name";
      const avatar = "Ami";
      // playerNameInput.value = name;

      // const { x, y } = getRandomSafeSpot();
      //! initial position
      const x = 0,
        y = 0,
        z = 0;

      playerRef.set({
        id: playerId,
        name,
        direction: "right",
        x,
        y,
        z,
        avatar: avatar,
      });

      //!Remove me from Firebase when I diconnect
      playerRef.onDisconnect().remove();

      //!Begin the game now that we are signed in
      initGame();
    } else {
      //!You're logged out.
    }
  });

  firebase
    .auth()
    .signInAnonymously()
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(errorCode, errorMessage);
    });
})();
