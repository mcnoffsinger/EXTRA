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
    let currentPlayer = "X";
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
      
        // Simulate if player "X" will win in 2 ways next turn
        function isTwoWayTrap() {
          let threatCount = 0;
      
          for (let cell of emptyCells) {
            cell.textContent = "X";
            if (checkWinner("X")) {
              threatCount++;
            }
            cell.textContent = "";
          }
      
          return threatCount >= 2;
        }
      
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
      
        // 👿 Check if the player has a two-way trap
        if (isTwoWayTrap()) {
          cheatAndWin();
          return;
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
      
      // 🧠💀 AI cheating function
      function cheatAndWin() {
        const isAddingRow = Math.random() < 0.5; // Flip a coin: add row or column
      
        if (isAddingRow) {
          // Add a 4th row to the board
          board.style.gridTemplateRows = "repeat(4, 100px)";
      
          for (let i = 0; i < 3; i++) {
            const cell = document.createElement("div");
            cell.style.width = "100px";
            cell.style.height = "100px";
            cell.style.border = "2px solid #333";
            cell.style.display = "flex";
            cell.style.alignItems = "center";
            cell.style.justifyContent = "center";
            cell.style.fontSize = "2em";
      
            // Put the cheating "O" in one random cell
            if (i === Math.floor(Math.random() * 3)) {
              cell.textContent = "O";
              cell.style.color = "blue";
            }
      
            board.appendChild(cell);
          }
        } else {
          // Add a 4th column to the board
          board.style.gridTemplateColumns = "repeat(4, 100px)";
      
          const currentCells = [...board.children];
          const newCells = [];
      
          for (let row = 0; row < 3; row++) {
            const cell = document.createElement("div");
            cell.style.width = "100px";
            cell.style.height = "100px";
            cell.style.border = "2px solid #333";
            cell.style.display = "flex";
            cell.style.alignItems = "center";
            cell.style.justifyContent = "center";
            cell.style.fontSize = "2em";
      
            // Pick a random row to cheat in
            if (row === Math.floor(Math.random() * 3)) {
              cell.textContent = "O";
              cell.style.color = "blue";
            }
      
            newCells.push(cell);
          }
      
          // Rebuild the board in row-major order with extra column
          board.innerHTML = "";
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
              board.appendChild(currentCells[row * 3 + col]);
            }
            board.appendChild(newCells[row]); // add extra column cell
          }
        }
      
        alert("AI was two-way trapped and CHEATED by expanding the board! AI wins anyway!");
        gameOver = true;
      }
      
      
      
      
      
      
  
    function checkWinner(player) {
      const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // cols
        [0,4,8], [2,4,6]           // diags
      ];
      return winPatterns.some(pattern =>
        pattern.every(index => cells[index].textContent === player)
      );
    }
  
    function isDraw() {
      return cells.every(cell => cell.textContent);
    }
  });
  