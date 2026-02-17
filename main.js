import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 DEINE FIREBASE SETTINGS
const firebaseConfig = {
  apiKey: "AIzaSyALbCmk9pVv5WUc1w9Zf9fSHshjhEc7UOw",
  authDomain: "sudoku-multiplayer-18534.firebaseapp.com",
  projectId: "sudoku-multiplayer-18534",
  storageBucket: "sudoku-multiplayer-18534.firebasestorage.app",
  messagingSenderId: "401519012394",
  appId: "1:401519012394:web:41470fa60f037bd73c7153",
  measurementId: "G-1B6EV80YYX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const boardRef = doc(db, "boards", "main");

const sudoku = document.getElementById("sudoku");
let currentGrid = {};
let originalGrid = {};

// 🧱 Grid erstellen
function createGrid() {
  sudoku.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {

      const input = document.createElement("input");
      input.id = `cell-${row}-${col}`;
      input.maxLength = 1;

      input.addEventListener("input", (e) => {
        const value = e.target.value;

        if (value < 1 || value > 9) {
          e.target.value = "";
          return;
        }

        updateCell(row, col, value);
      });

      sudoku.appendChild(input);
    }
  }
}

createGrid();


// 🔄 Live Listener (Multiplayer)
onSnapshot(boardRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    currentGrid = data.grid;
    originalGrid = JSON.parse(JSON.stringify(data.grid));
    renderGrid();
  }
});


function renderGrid() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {

      const input = document.getElementById(`cell-${row}-${col}`);
      const value = currentGrid[`row${row}`][col];

      input.value = value === 0 ? "" : value;

      if (originalGrid[`row${row}`][col] !== 0) {
        input.disabled = true; // gegebene Zahl
      } else {
        input.disabled = false;
      }
    }
  }
}


// 🔥 Zelle speichern
async function updateCell(row, col, value) {
  await updateDoc(boardRef, {
    [`grid.row${row}.${col}`]: Number(value)
  });
}


// ✅ Fertig Button Check
window.checkSudoku = function() {

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {

      const value = document.getElementById(`cell-${row}-${col}`).value;

      if (!value || value < 1 || value > 9) {
        document.getElementById("result").innerText = "❌ Nicht richtig!";
        return;
      }
    }
  }

  document.getElementById("result").innerText = "✅ Richtig!";
};
