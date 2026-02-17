import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update, get }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyALbCmk9pVv5WUc1w9Zf9fSHshjhEc7UOw",
  authDomain: "sudoku-multiplayer-18534.firebaseapp.com",
  databaseURL: "https://sudoku-multiplayer-18534-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sudoku-multiplayer-18534",
  storageBucket: "sudoku-multiplayer-18534.firebasestorage.app",
  messagingSenderId: "401519012394",
  appId: "1:401519012394:web:41470fa60f037bd73c7153"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const roomId = "room1";

const boardRef = ref(db, "rooms/" + roomId + "/board");


// 🔥 Raum nur erstellen wenn er noch nicht existiert
async function initRoom() {
  const snapshot = await get(boardRef);

  if (!snapshot.exists()) {
    await set(ref(db, "rooms/" + roomId), {
      board: Array(81).fill("")
    });
  }
}

initRoom();


// 🧩 GRID ERSTELLEN
const container = document.getElementById("sudoku");

for (let i = 0; i < 81; i++) {
  const input = document.createElement("input");
  input.maxLength = 1;

  input.addEventListener("input", (e) => {
    const value = e.target.value.replace(/[^1-9]/g, "");
    e.target.value = value;

    update(ref(db, "rooms/" + roomId + "/board"), {
      [i]: value
    });
  });

  container.appendChild(input);
}


// 🔄 LIVE UPDATES
onValue(boardRef, (snapshot) => {
  const board = snapshot.val();
  if (!board) return;

  const inputs = document.querySelectorAll("#sudoku input");

  board.forEach((value, index) => {
    inputs[index].value = value;
  });
});
