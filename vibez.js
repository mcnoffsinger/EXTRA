document.addEventListener("DOMContentLoaded", () => {
    // Create and style the game board
    const board = document.createElement("div");
    board.style.display = "grid";
    board.style.gridTemplateColumns = "repeat(3, 100px)";
    board.style.gridTemplateRows = "repeat(3, 100px)";
    board.style.gap = "5px";
    board.style.margin = "50px auto";
    board.style.width = "max-content";
    // Wrap the board in a container to center it
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.gap = "40px"; // space between board and cheat X
    container.style.height = "100vh";
    container.style.backgroundColor = "#f0f0f0"; // Optional: add a soothing gray because, you know, emotions
    document.body.appendChild(container);
    container.appendChild(board);
  
    const cells = [];
    
    let gameOver = false;
  
    // Create cells
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.style.width = "100px";
      cell.style.height = "100px";
      cell.style.border = "2px solid #333";
      cell.style.display = "flex";
      cell.style.alignItems = "center";
      cell.style.justifyContent = "center";
      cell.style.fontSize = "2em";
      cell.dataset.index = i;
      board.appendChild(cell);
      cells.push(cell);
  
      // Player move
      cell.addEventListener("click", () => {
        if (cell.textContent || gameOver) return;
  
        cell.textContent = "X";
        cell.style.color = "red";;
        if (checkWinner("X")) {
          alert("You win!");
          gameOver = true;
          return;
        }
  
        if (isDraw()) {
          alert("It's a draw!");
          gameOver = true;
          return;
        }
  
        setTimeout(aiMove, 300); // Give a short delay before AI moves
      });
    }
  
    function aiMove() {
        if (gameOver) return;
      
        const emptyCells = cells.filter(cell => !cell.textContent);
      
        // Helper to simulate placing a move and checking for a win
        function tryMove(player) {
          for (let cell of emptyCells) {
            cell.textContent = player;
            const isWin = checkWinner(player);
            cell.textContent = "";
            if (isWin) return cell;
          }
          return null;
        }
      
        // Get all win patterns for "X"
        function getPlayerThreats() {
          const threats = [];
          const positions = cells.map(cell => cell.textContent);
      
          const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6],           // diagonals
          ];
      
          for (let line of lines) {
            const lineValues = line.map(i => positions[i]);
            const xCount = lineValues.filter(val => val === "X").length;
            const emptyCount = lineValues.filter(val => val === "").length;
            if (xCount === 2 && emptyCount === 1) {
              threats.push(line);
            }
          }
      
          return threats;
        }
      
        const threats = getPlayerThreats();
      
        if (threats.length >= 2) {
          const types = {
            row: false,
            col: false,
            diag: false,
          };
      
          for (let line of threats) {
            if ([0, 1, 2].every(i => line.includes(i)) ||
                [3, 4, 5].every(i => line.includes(i)) ||
                [6, 7, 8].every(i => line.includes(i))) types.row = true;
            if ([0, 3, 6].every(i => line.includes(i)) ||
                [1, 4, 7].every(i => line.includes(i)) ||
                [2, 5, 8].every(i => line.includes(i))) types.col = true;
            if ([0, 4, 8].every(i => line.includes(i)) ||
                [2, 4, 6].every(i => line.includes(i))) types.diag = true;
          }
      
          const diagonalThreat = threats.find(line =>
            [0, 4, 8].every(i => line.includes(i)) ||
            [2, 4, 6].every(i => line.includes(i))
          );
      
          if (diagonalThreat) {
            // Block the diagonal first
            const blockIndex = diagonalThreat.find(i => !cells[i].textContent);
            cells[blockIndex].textContent = "O";
            cells[blockIndex].style.color = "blue";
      
            if (types.row) {
              addCheatingColumn(); // horizontal + diagonal => add column
            } else if (types.col) {
              addCheatingRow(); // vertical + diagonal => add row
            }
      
            //alert("AI changed the rules mid-game! You now need FOUR in a row to win. Good luck...");
            return;
          }
        }
      
        // 1. Try to win
        let move = tryMove("O");
        if (!move) {
          // 2. Try to block player
          move = tryMove("X");
        }
        if (!move) {
          // 3. Pick random move
          move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
      
        move.textContent = "O";
        move.style.color = "blue";
      
        if (checkWinner("O")) {
          alert("AI wins!");
          gameOver = true;
          return;
        }
      
        if (isDraw()) {
          alert("It's a draw!");
          gameOver = true;
        }
      }

      function addCheatingRow() {
        board.style.gridTemplateRows = "repeat(4, 100px)";
      
        for (let i = 0; i < 3; i++) {
          const cell = document.createElement("div");
          const index = cells.length;
          styleCell(cell, index);
          cell.addEventListener("click", () => {
            if (cell.textContent === "" && !gameOver) {
              cell.textContent = "X";
              cell.style.color = "red";
              if (checkWinner("X")) {
                gameOver = true;
                alert("You win!");
                return;
              }
              aiMove();
            }
          });
          board.appendChild(cell);
          cells.push(cell);
        }
      }
      
      
      function addCheatingColumn() {
        board.style.gridTemplateColumns = "repeat(4, 100px)";
      
        const currentCells = [...cells];
        board.innerHTML = "";
        const newCells = [];
      
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const cell = currentCells[row * 3 + col];
            board.appendChild(cell);
          }
      
          const newCell = document.createElement("div");
          const index = cells.length;
          styleCell(newCell, index);
          newCell.addEventListener("click", () => {
            if (newCell.textContent === "" && !gameOver) {
              newCell.textContent = "X";
              newCell.style.color = "red";
              if (checkWinner("X")) {
                gameOver = true;
                alert("You win!");
                return;
              }
              aiMove();
            }
          });
      
          board.appendChild(newCell);
          cells.push(newCell);
        }
      }
      
      
      
      
      function styleCell(cell, index) {
        cell.style.width = "100px";
        cell.style.height = "100px";
        cell.style.border = "2px solid #333";
        cell.style.display = "flex";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";
        cell.style.fontSize = "2em";
        cell.setAttribute("data-index", index);
      }
      
      

      
      
      
      
      
      
      
      
      
 /* 
function checkWinner(player) {
  const gridSize = Math.sqrt(cells.length); // 3 or 4
  const winLength = gridSize === 4 ? 4 : 3;

  // Helper to get value at row,col
  function getCell(row, col) {
    return cells[row * gridSize + col];
  }

  for (let row = 0; row <= gridSize - winLength; row++) {
    for (let col = 0; col <= gridSize - winLength; col++) {
      // Check all directions from this starting cell

      // Horizontal
      for (let r = row; r < row + winLength; r++) {
        let count = 0;
        for (let c = 0; c < gridSize; c++) {
            console.log(r)
            console.log(c)
            console.log(getCell(r,c))
          if (getCell(r, c).textContent === player) count++;
          else count = 0;
          if (count === winLength) return true;
        }
      }

      // Vertical
      for (let c = col; c < col + winLength; c++) {
        let count = 0;
        for (let r = 0; r < gridSize; r++) {
          if (getCell(r, c).textContent === player) count++;
          else count = 0;
          if (count === winLength) return true;
        }
      }

      // Diagonal (top-left to bottom-right)
      for (let r = 0; r <= gridSize - winLength; r++) {
        for (let c = 0; c <= gridSize - winLength; c++) {
          let count = 0;
          for (let i = 0; i < winLength; i++) {
            if (getCell(r + i, c + i).textContent === player) count++;
            else break;
          }
          if (count === winLength) return true;
        }
      }

      // Diagonal (top-right to bottom-left)
      for (let r = 0; r <= gridSize - winLength; r++) {
        for (let c = winLength - 1; c < gridSize; c++) {
          let count = 0;
          for (let i = 0; i < winLength; i++) {
            if (getCell(r + i, c - i).textContent === player) count++;
            else break;
          }
          if (count === winLength) return true;
        }
      }
    }
  }

  return false;
}*/
function checkWinner(player) {
    const totalCells = cells.length;
  
    const numRows = board.style.gridTemplateRows.split(" ").length;
    const numCols = board.style.gridTemplateColumns.split(" ").length;
  
    const winLength = (numRows === 4 || numCols === 4) ? 4 : 3;
  
    // Convert flat cells array to 2D grid of text content
    const grid = [];
    for (let r = 0; r < numRows; r++) {
      grid[r] = [];
      for (let c = 0; c < numCols; c++) {
        const index = r * numCols + c;
        grid[r][c] = cells[index]?.textContent || "";
      }
    }
  
    // Check all directions from each cell
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (grid[r][c] !== player) continue;
  
        // Horizontal →
        if (c <= numCols - winLength) {
          let match = true;
          for (let i = 1; i < winLength; i++) {
            if (grid[r][c + i] !== player) {
              match = false;
              break;
            }
          }
          if (match) return true;
        }
  
        // Vertical ↓
        if (r <= numRows - winLength) {
          let match = true;
          for (let i = 1; i < winLength; i++) {
            if (grid[r + i][c] !== player) {
              match = false;
              break;
            }
          }
          if (match) return true;
        }
  
        // Diagonal ↘
        if (r <= numRows - winLength && c <= numCols - winLength) {
          let match = true;
          for (let i = 1; i < winLength; i++) {
            if (grid[r + i][c + i] !== player) {
              match = false;
              break;
            }
          }
          if (match) return true;
        }
  
        // Diagonal ↙
        if (r <= numRows - winLength && c >= winLength - 1) {
          let match = true;
          for (let i = 1; i < winLength; i++) {
            if (grid[r + i][c - i] !== player) {
              match = false;
              break;
            }
          }
          if (match) return true;
        }
      }
    }
  
    return false;
  }
  
  

  
    function isDraw() {
      return cells.every(cell => cell.textContent);
    }
  });
  