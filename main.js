import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 DEINE CONFIG HIER
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_AUTH",
  projectId: "DEIN_PROJECT_ID",
  storageBucket: "DEIN_BUCKET",
  messagingSenderId: "DEIN_ID",
  appId: "DEINE_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const boardRef = doc(db, "boards", "main");

const sudoku = document.getElementById("sudoku");
let currentGrid = {};
let originalGrid = {};

// Grid erstellen
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


// 🔄 LIVE FIRESTORE LISTENER
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
        input.disabled = true;
      } else {
        input.disabled = false;
      }
    }
  }
}


// 🔥 Zelle updaten
async function updateCell(row, col, value) {
  await updateDoc(boardRef, {
    [`grid.row${row}.${col}`]: Number(value)
  });
}


// ✅ Sudoku prüfen
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
