/*
const game = {
    board: [],
    size: 3,
    winLength: 3,
    player: 'X',
    bot: 'O',
    currentPlayer: 'X',
  
    init() {
      this.createBoard(this.size);
      this.render();
    },
  
    createBoard(size) {
      this.board = Array.from({ length: size }, () => Array(size).fill(''));
    },
  
    render() {
      document.body.innerHTML = '';
      const boardEl = document.createElement('div');
      boardEl.style.display = 'grid';
      boardEl.style.gridTemplateColumns = `repeat(${this.board.length}, 50px)`;
      boardEl.style.gap = '2px';
  
      this.board.forEach((row, y) => {
        row.forEach((cell, x) => {
          const cellEl = document.createElement('div');
          cellEl.textContent = cell;
          cellEl.style.width = '50px';
          cellEl.style.height = '50px';
          cellEl.style.display = 'flex';
          cellEl.style.alignItems = 'center';
          cellEl.style.justifyContent = 'center';
          cellEl.style.backgroundColor = '#eee';
          cellEl.style.fontSize = '24px';
          cellEl.style.cursor = 'pointer';
          cellEl.addEventListener('click', () => this.handleMove(x, y));
          boardEl.appendChild(cellEl);
        });
      });
      const counter = document.createElement('div');
      if (this.winLength > 3){
      
      counter.textContent = `Win condition: ${this.winLength} in a row`;
      counter.style.marginTop = '10px';
      counter.style.fontSize = '18px';
      counter.style.fontFamily = 'sans-serif';}
  
      document.body.appendChild(boardEl);
      document.body.appendChild(counter);
    },
  
    handleMove(x, y) {
      if (this.board[y][x] || this.currentPlayer !== this.player) return;
      this.board[y][x] = this.player;
      this.currentPlayer = this.bot;
      if (this.checkWinner(this.player)) {
        this.render();
        alert('You win!');
        return;
      }
      this.checkExpansion();
      this.render();
      setTimeout(() => this.botMove(), 300);
    },
  
    botMove() {
      if (this.preventLoss()) {
        this.render();
        if (this.checkWinner(this.bot)) {
          alert('Bot wins!');
          return;
        }
        this.currentPlayer = this.player;
        return;
      }
  
      const winMove = this.findWinningMove(this.bot);
      if (winMove) {
        this.board[winMove.y][winMove.x] = this.bot;
      } else {
        const empty = this.getEmptyCells();
        const rand = empty[Math.floor(Math.random() * empty.length)];
        if (rand) this.board[rand.y][rand.x] = this.bot;
      }
      if (this.checkWinner(this.bot)) {
        this.render();
        alert('Bot wins!');
        return;
      }
      this.currentPlayer = this.player;
      this.checkExpansion();
      this.render();
    },
  
    getEmptyCells() {
      const cells = [];
      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          if (!this.board[y][x]) cells.push({ x, y });
        }
      }
      return cells;
    },
  
    findWinningMove(symbol) {
      for (const cell of this.getEmptyCells()) {
        this.board[cell.y][cell.x] = symbol;
        if (this.checkWinner(symbol)) {
          this.board[cell.y][cell.x] = '';
          return cell;
        }
        this.board[cell.y][cell.x] = '';
      }
      return null;
    },
  
    preventLoss() {
      const threats = [];
      for (const cell of this.getEmptyCells()) {
        this.board[cell.y][cell.x] = this.player;
        if (this.checkWinner(this.player)) threats.push(cell);
        this.board[cell.y][cell.x] = '';
      }
  
      if (threats.length > 1) {
        this.expandBoard();
        return true;
      } else if (threats.length === 1) {
        const threat = threats[0];
        this.board[threat.y][threat.x] = this.bot;
        this.currentPlayer = this.player;
        return true;
      }
      return false;
    },
  
    expandBoard() {
      const newSize = this.board.length + 1;
      this.board.forEach(row => row.push(''));
      this.board.push(Array(newSize).fill(''));
      if (newSize > this.winLength) this.winLength++;
      this.render();
    },
  
    checkExpansion() {
      const filled = this.board.flat().filter(c => c).length;
      const total = this.board.length ** 2;
      if (filled === total) this.doubleBoard();
    },
  
    doubleBoard() {
      const oldSize = this.board.length;
      const newSize = oldSize * 2;
      const newBoard = Array.from({ length: newSize }, () => Array(newSize).fill(''));
      for (let y = 0; y < oldSize; y++) {
        for (let x = 0; x < oldSize; x++) {
          newBoard[y][x] = this.board[y][x];
        }
      }
      this.board = newBoard;
      this.winLength++;
      this.render();
    },
  
    checkWinner(symbol) {
      const size = this.board.length;
      const len = this.winLength;
  
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (
            this.checkDirection(x, y, 1, 0, symbol, len) ||
            this.checkDirection(x, y, 0, 1, symbol, len) ||
            this.checkDirection(x, y, 1, 1, symbol, len) ||
            this.checkDirection(x, y, 1, -1, symbol, len)
          ) {
            return true;
          }
        }
      }
      return false;
    },
  
    checkDirection(x, y, dx, dy, symbol, length) {
      for (let i = 0; i < length; i++) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        if (
          ny < 0 || ny >= this.board.length ||
          nx < 0 || nx >= this.board.length ||
          this.board[ny][nx] !== symbol
        ) {
          return false;
        }
      }
      return true;
    }
  };
  
  game.init();
  
  const game = {
    board: [],
    size: 3,
    winLength: 3,
    player: 'X',
    bot: 'O',
    currentPlayer: 'X',
  
    init() {
      this.createBoard(this.size);
      this.render();
    },
  
    createBoard(size) {
      this.board = Array.from({ length: size }, () => Array(size).fill(''));
    },
  
    render() {
      document.body.innerHTML = '';
  
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.height = '100vh';
  
      const boardEl = document.createElement('div');
      boardEl.style.display = 'grid';
      boardEl.style.gridTemplateColumns = `repeat(${this.board.length}, 50px)`;
      boardEl.style.gap = '2px';
  
      this.board.forEach((row, y) => {
        row.forEach((cell, x) => {
          const cellEl = document.createElement('div');
          cellEl.textContent = cell;
          cellEl.style.width = '50px';
          cellEl.style.height = '50px';
          cellEl.style.display = 'flex';
          cellEl.style.alignItems = 'center';
          cellEl.style.justifyContent = 'center';
          cellEl.style.backgroundColor = '#eee';
          cellEl.style.fontSize = '24px';
          cellEl.style.cursor = 'pointer';
          cellEl.addEventListener('click', () => this.handleMove(x, y));
          boardEl.appendChild(cellEl);
        });
      });
  
      const counter = document.createElement('div');
      counter.textContent = `Win condition: ${this.winLength} in a row`;
      counter.style.marginTop = '10px';
      counter.style.fontSize = '18px';
      counter.style.fontFamily = 'sans-serif';
  
      container.appendChild(boardEl);
      container.appendChild(counter);
      document.body.appendChild(container);
    },
  
    handleMove(x, y) {
      if (this.board[y][x] || this.currentPlayer !== this.player) return;
      this.board[y][x] = this.player;
      this.currentPlayer = this.bot;
      if (this.checkWinner(this.player)) {
        this.render();
        alert('You win!');
        return;
      }
      this.checkExpansion();
      this.render();
      setTimeout(() => this.botMove(), 300);
    },
  
    botMove() {
      if (this.preventLoss()) {
        this.render();
        if (this.checkWinner(this.bot)) {
          alert('Bot wins!');
          return;
        }
        this.currentPlayer = this.player;
        return;
      }
  
      const winMove = this.findWinningMove(this.bot);
      if (winMove) {
        this.board[winMove.y][winMove.x] = this.bot;
      } else {
        const empty = this.getEmptyCells();
        const rand = empty[Math.floor(Math.random() * empty.length)];
        if (rand) this.board[rand.y][rand.x] = this.bot;
      }
      if (this.checkWinner(this.bot)) {
        this.render();
        alert('Bot wins!');
        return;
      }
      this.currentPlayer = this.player;
      this.checkExpansion();
      this.render();
    },
  
    getEmptyCells() {
      const cells = [];
      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          if (!this.board[y][x]) cells.push({ x, y });
        }
      }
      return cells;
    },
  
    findWinningMove(symbol) {
      for (const cell of this.getEmptyCells()) {
        this.board[cell.y][cell.x] = symbol;
        if (this.checkWinner(symbol)) {
          this.board[cell.y][cell.x] = '';
          return cell;
        }
        this.board[cell.y][cell.x] = '';
      }
      return null;
    },
  
    preventLoss() {
      const threats = [];
      for (const cell of this.getEmptyCells()) {
        this.board[cell.y][cell.x] = this.player;
        if (this.checkWinner(this.player)) threats.push(cell);
        this.board[cell.y][cell.x] = '';
      }
  
      if (threats.length > 1) {
        this.expandBoard();
        return true;
      } else if (threats.length === 1) {
        const threat = threats[0];
        this.board[threat.y][threat.x] = this.bot;
        this.currentPlayer = this.player;
        return true;
      }
      return false;
    },
  
    expandBoard() {
      const newSize = this.board.length + 1;
      this.board.forEach(row => row.push(''));
      this.board.push(Array(newSize).fill(''));
      if (newSize > this.winLength) this.winLength++;
      this.render();
    },
  
    checkExpansion() {
      const filled = this.board.flat().filter(c => c).length;
      const total = this.board.length ** 2;
      if (filled === total) this.doubleBoard();
    },
  
    doubleBoard() {
      const oldSize = this.board.length;
      const newSize = oldSize * 2;
      const newBoard = Array.from({ length: newSize }, () => Array(newSize).fill(''));
      for (let y = 0; y < oldSize; y++) {
        for (let x = 0; x < oldSize; x++) {
          newBoard[y][x] = this.board[y][x];
        }
      }
      this.board = newBoard;
      this.winLength++;
      this.render();
    },
  
    checkWinner(symbol) {
      const size = this.board.length;
      const len = this.winLength;
  
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (
            this.checkDirection(x, y, 1, 0, symbol, len) ||
            this.checkDirection(x, y, 0, 1, symbol, len) ||
            this.checkDirection(x, y, 1, 1, symbol, len) ||
            this.checkDirection(x, y, 1, -1, symbol, len)
          ) {
            return true;
          }
        }
      }
      return false;
    },
  
    checkDirection(x, y, dx, dy, symbol, length) {
      for (let i = 0; i < length; i++) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        if (
          ny < 0 || ny >= this.board.length ||
          nx < 0 || nx >= this.board.length ||
          this.board[ny][nx] !== symbol
        ) {
          return false;
        }
      }
      return true;
    }
  };
  
  game.init();
  */
  const game = {
    board: [],
    size: 3,
    winLength: 3,
    player: 'X',
    bot: 'O',
    currentPlayer: 'X',
  
    init() {
      this.createBoard(this.size);
      this.render();
    },
  
    createBoard(size) {
      this.board = Array.from({ length: size }, () => Array(size).fill(''));
    },
  
    render() {
      document.body.innerHTML = '';
  
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.height = '100vh';
  
      const boardEl = document.createElement('div');
      boardEl.style.display = 'grid';
      boardEl.style.gridTemplateColumns = `repeat(${this.board.length}, 50px)`;
      boardEl.style.gap = '2px';
  
      this.board.forEach((row, y) => {
        row.forEach((cell, x) => {
          const cellEl = document.createElement('div');
          cellEl.textContent = cell;
          cellEl.style.width = '50px';
          cellEl.style.height = '50px';
          cellEl.style.display = 'flex';
          cellEl.style.alignItems = 'center';
          cellEl.style.justifyContent = 'center';
          cellEl.style.backgroundColor = '#eee';
          cellEl.style.fontSize = '24px';
          cellEl.style.cursor = 'pointer';
          cellEl.style.color = cell === 'X' ? 'red' : cell === 'O' ? 'blue' : 'black';
          cellEl.addEventListener('click', () => this.handleMove(x, y));
          boardEl.appendChild(cellEl);
        });
      });
  
      const counter = document.createElement('div');
      counter.textContent = `Win condition: ${this.winLength} in a row`;
      counter.style.marginTop = '10px';
      counter.style.fontSize = '18px';
      counter.style.fontFamily = 'sans-serif';
  
      container.appendChild(boardEl);
      container.appendChild(counter);
      document.body.appendChild(container);
    },
  
    handleMove(x, y) {
      if (this.board[y][x] || this.currentPlayer !== this.player) return;
      this.board[y][x] = this.player;
      this.currentPlayer = this.bot;
      if (this.checkWinner(this.player)) {
        this.render();
        alert('You win!');
        return;
      }
      this.checkExpansion();
      this.render();
      setTimeout(() => this.botMove(), 300);
    },
  
    botMove() {
      if (this.preventLoss()) {
        this.render();
        if (this.checkWinner(this.bot)) {
          alert('Bot wins!');
          return;
        }
        this.currentPlayer = this.player;
        return;
      }
  
      const winMove = this.findWinningMove(this.bot);
      if (winMove) {
        this.board[winMove.y][winMove.x] = this.bot;
      } else {
        const empty = this.getEmptyCells();
        const rand = empty[Math.floor(Math.random() * empty.length)];
        if (rand) this.board[rand.y][rand.x] = this.bot;
      }
      if (this.checkWinner(this.bot)) {
        this.render();
        alert('Bot wins!');
        return;
      }
      this.currentPlayer = this.player;
      this.checkExpansion();
      this.render();
    },
  
    getEmptyCells() {
      const cells = [];
      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          if (!this.board[y][x]) cells.push({ x, y });
        }
      }
      return cells;
    },
  
    findWinningMove(symbol) {
      for (const cell of this.getEmptyCells()) {
        this.board[cell.y][cell.x] = symbol;
        if (this.checkWinner(symbol)) {
          this.board[cell.y][cell.x] = '';
          return cell;
        }
        this.board[cell.y][cell.x] = '';
      }
      return null;
    },
  
    preventLoss() {
      const threats = [];
      for (const cell of this.getEmptyCells()) {
        this.board[cell.y][cell.x] = this.player;
        if (this.checkWinner(this.player)) threats.push(cell);
        this.board[cell.y][cell.x] = '';
      }
  
      if (threats.length > 1) {
        this.expandBoard();
        return true;
      } else if (threats.length === 1) {
        const threat = threats[0];
        this.board[threat.y][threat.x] = this.bot;
        this.currentPlayer = this.player;
        return true;
      }
      return false;
    },
  
    expandBoard() {
      const newSize = this.board.length + 1;
      this.board.forEach(row => row.push(''));
      this.board.push(Array(newSize).fill(''));
      if (newSize > this.winLength) this.winLength++;
      this.render();
    },
  
    checkExpansion() {
      const filled = this.board.flat().filter(c => c).length;
      const total = this.board.length ** 2;
      if (filled === total) this.doubleBoard();
    },
  
    doubleBoard() {
      const oldSize = this.board.length;
      const newSize = oldSize * 2;
      const newBoard = Array.from({ length: newSize }, () => Array(newSize).fill(''));
      for (let y = 0; y < oldSize; y++) {
        for (let x = 0; x < oldSize; x++) {
          newBoard[y][x] = this.board[y][x];
        }
      }
      this.board = newBoard;
      this.winLength++;
      this.render();
    },
  
    checkWinner(symbol) {
      const size = this.board.length;
      const len = this.winLength;
  
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          if (
            this.checkDirection(x, y, 1, 0, symbol, len) ||
            this.checkDirection(x, y, 0, 1, symbol, len) ||
            this.checkDirection(x, y, 1, 1, symbol, len) ||
            this.checkDirection(x, y, 1, -1, symbol, len)
          ) {
            return true;
          }
        }
      }
      return false;
    },
  
    checkDirection(x, y, dx, dy, symbol, length) {
      for (let i = 0; i < length; i++) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        if (
          ny < 0 || ny >= this.board.length ||
          nx < 0 || nx >= this.board.length ||
          this.board[ny][nx] !== symbol
        ) {
          return false;
        }
      }
      return true;
    }
  };
  
  game.init();
  
  