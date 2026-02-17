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
const roomRef = ref(db, "rooms/" + roomId);

// ✅ KOMPLETTE LÖSUNG
const solution = [
5,3,4,6,7,8,9,1,2,
6,7,2,1,9,5,3,4,8,
1,9,8,3,4,2,5,6,7,
8,5,9,7,6,1,4,2,3,
4,2,6,8,5,3,7,9,1,
7,1,3,9,2,4,8,5,6,
9,6,1,5,3,7,2,8,4,
2,8,7,4,1,9,6,3,5,
3,4,5,2,8,6,1,7,9
];

// ✅ FESTE VORGEGEBENE ZAHLEN (lösbar!)
const puzzle = [
5,3,0,0,7,0,0,0,0,
6,0,0,1,9,5,0,0,0,
0,9,8,0,0,0,0,6,0,
8,0,0,0,6,0,0,0,3,
4,0,0,8,0,3,0,0,1,
7,0,0,0,2,0,0,0,6,
0,6,0,0,0,0,2,8,0,
0,0,0,4,1,9,0,0,5,
0,0,0,0,8,0,0,7,9
];

async function initGame() {
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    await set(roomRef, {
      board: puzzle
    });
  }
}

initGame();

const container = document.getElementById("sudoku");
let inputs = [];

// 🧩 GRID
for (let i = 0; i < 81; i++) {
  const input = document.createElement("input");
  input.maxLength = 1;

  if (puzzle[i] !== 0) {
    input.value = puzzle[i];
    input.disabled = true;
    input.classList.add("given");
  }

  input.addEventListener("input", (e) => {
    const value = e.target.value.replace(/[^1-9]/g, "");
    e.target.value = value;

    update(ref(db, "rooms/" + roomId + "/board"), {
      [i]: value ? parseInt(value) : 0
    });
  });

  inputs.push(input);
  container.appendChild(input);
}

// 🔄 LIVE UPDATE
onValue(ref(db, "rooms/" + roomId + "/board"), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  const board = data;

  board.forEach((val, i) => {
    if (!inputs[i].disabled) {
      inputs[i].value = val === 0 ? "" : val;
    }
  });
});

// ✅ FERTIG BUTTON
document.getElementById("finishBtn").addEventListener("click", async () => {

  const snapshot = await get(ref(db, "rooms/" + roomId + "/board"));
  const board = snapshot.val();

  let correct = true;

  for (let i = 0; i < 81; i++) {
    if (board[i] !== solution[i]) {
      correct = false;
      break;
    }
  }

  if (correct) {
    document.getElementById("status").innerText = "✅ Richtig gelöst!";
  } else {
    document.getElementById("status").innerText = "❌ Das ist noch nicht korrekt!";
  }
});
