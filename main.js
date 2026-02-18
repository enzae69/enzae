import { setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function generateBoard() {

  const newBoard = {
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

  await setDoc(boardRef, newBoard);
  console.log("Sudoku generiert 🔥");
}

generateBoard();
