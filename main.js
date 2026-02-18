import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  onSnapshot, 
  updateDoc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


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
let originalGrid = {};


// 🧱 Grid erstellen
function createGrid() {
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


// 🔥 EINMALIG Sudoku generieren
async function generateBoard() {
  const board = {
    grid: {
      row0: [5,3,0,0,7,0,0,0,0],
      row1: [6,0,0,1,9,5,0,0,0],
      row2: [0,9,8,0,0,0,0,6,0],
      row3: [8,0,0,0,6,0,0,0,3],
      row4: [4,0,0,8,0,3,0,0,1],
      row5: [7,0,0,0,2,0,0,0,6],
      row6: [0,6,0,0,0,0,2,8,0],
      row7: [0,0,0,4,1,9,0,0,5],
      row8: [0,0,0,0,8,0,0,7,9]
    }
  };

  await setDoc(boardRef, board);
}

// ⚠️ NUR EINMAL BENUTZEN dann auskommentieren
generateBoard();


// 🔄 Live Multiplayer Listener
onSnapshot(boardRef, (docSnap) => {

  if (!docSnap.exists()) return;

  const data = docSnap.data();
  const grid = data.grid;

  originalGrid = JSON.parse(JSON.stringify(grid));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {

      const input = document.getElementById(`cell-${row}-${col}`);
      const value = grid[`row${row}`][col];

      input.value = value === 0 ? "" : value;

      if (originalGrid[`row${row}`][col] !== 0) {
        input.disabled = true;
      } else {
        input.disabled = false;
      }
    }
  }

});


// 🔥 Zelle speichern
async function updateCell(row, col, value) {
  await updateDoc(boardRef, {
    [`grid.row${row}.${col}`]: Number(value)
  });
}


// ✅ Fertig Button
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
