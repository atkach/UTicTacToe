
const Game = function () {
  this.round = 0;
  this.move = 0;
  this.players = {};
  this.timebank = 10000;
  this.mBoard = [];
  this.mMacroboard = [];
  this.finished = true;

  this._initBoard();
  this._initMacroBoard();
};


Game.prototype.start = function () {
  this.finished = false;
  this.requestMove(this.players[1]);
};


Game.prototype.recieveMove = function (id, move) {
  const opponentId = id === 1 ? 2 : 1;

  this._insertMove(id, move);
  if (this.finished) {
    return;
  }
  setTimeout(() => {
    this.requestMove(this.players[opponentId])
  }, 10);
};

Game.prototype.requestMove = function (bot) {
  this.move++;
  this.round = Math.ceil(this.move / 2);
  bot.send(`update game round ${this.round}\n` +
    `update game move ${this.move}\n` +
    `update game field ${this._printField(this.mBoard)}\n` +
    `update game macroboard ${this._printField(this.mMacroboard)}\n` +
    `action move ${this.timebank}`);
};

Game.prototype.initBot = function (bot, id) {
  this.players[id] = bot;
  bot.send(`settings timebank ${this.timebank}\n` +
    "settings time_per_move 500\n" +
    "settings player_names player1,player2\n" +
    "settings your_bot player1\n" +
    `settings your_botid ${id}`);
};

Game.prototype.onFinish = function (cb) {
  return new Promise((resolve) => {
    this.resolve = resolve;
  }).then(cb);
};

Game.prototype.finishGame = function(status) {
  this.finished = true;
  this.resolve();
  console.log(this.toString(this.mBoard));
  console.log(this.toString(this.mMacroboard));
  if (status === 1) {
    console.log('Player 1 won!');
  } else if (status === 2) {
    console.log('Player 2 won!');
  } else {
    console.log('Draw!');
  }
  console.log('GAME OVER');

};

Game.prototype._printField = function (array) {
  let output = "";
  for (let i = 0; i < array.length; i++) {
    output += array[i].join(',') + ((i < array.length - 1) ? ',' : '');
  }
  return output;
};

Game.prototype._insertMove = function (id, move) {
  const input = move.split(' ').map(Number);
  const col = input[1];
  const row = input[2];
  if (this.mBoard[row][col] !== 0) {
    this.finishGame();
    throw Error('WRONG CELL');
    return;
  }
  this.mBoard[row][col] = id;
  this._updateMacroBoard(col, row);
  // console.log('BOARDS:');
  // console.log(this.toString(this.mBoard));
  // console.log(this.toString(this.mMacroboard));
  const arrayMacroboard = this.mMacroboard.reduce((p, n) => {
    return p.concat(n);
  });
  if (this._getMicroBoardStatus(arrayMacroboard) > 0) {
    this.finishGame(this._getMicroBoardStatus(arrayMacroboard));
  }
};

Game.prototype._updateMacroBoard = function(col, row) {
  const macroRow = row - (Math.floor(row / 3) * 3);
  const macroCol = col - (Math.floor(col / 3) * 3);
  const nextMacroCellStatus = this._getMacroCellStatus(macroRow, macroCol);

  for (let yRow = 0; yRow < 3; yRow++) {
    for (let xCol = 0; xCol < 3; xCol++) {
      if (macroRow === yRow && macroCol === xCol) {
        this.mMacroboard[macroRow][macroCol] = nextMacroCellStatus > 0 ? this._getMacroCellStatus(macroRow, macroCol) : -1;
      } else {
        if (nextMacroCellStatus > 0) {
          //next macro board is won
          this.mMacroboard[yRow][xCol] = this._getMacroCellStatus(yRow, xCol) === 0 ? -1 : this._getMacroCellStatus(yRow, xCol);
        } else {
          // next macro board not won
          this.mMacroboard[yRow][xCol] = this._getMacroCellStatus(yRow, xCol);
        }
      }
    }
  }
};

Game.prototype._getMacroCellStatus = function (yRow, xCol) {
  const board = this._getPartOfBoard(yRow, xCol);
  return this._getMicroBoardStatus(board);
};

Game.prototype._getPartOfBoard = function(yRow, xCol) {
  const miniBoard = [];
  const xMinBound = xCol * 3;
  const xMaxBound = 3 * (xCol + 1);
  const yMinBound = yRow * 3;
  const yMaxBound = 3 * (yRow + 1);

  for (let kRow = 0; kRow < this.mBoard.length; kRow++) {
    for (let nCol = 0; nCol < this.mBoard[kRow].length; nCol++) {
      if (((nCol >= xMinBound) && (nCol < xMaxBound)) &&
          ((kRow >= yMinBound) && (kRow < yMaxBound))) {
          miniBoard.push(this.mBoard[kRow][nCol]);
      }
    }
  }
  return miniBoard;
};

Game.prototype._getMicroBoardStatus = function(board) {
  if (this._isPlayerWonMicroBoard(board, 1)) {
    return 1;
  } else if (this._isPlayerWonMicroBoard(board, 2)) {
    return 2;
  } else if ((board.every((cell) => cell > 0))) {
    return 3;
  } else {
    return 0;
  }
};

Game.prototype._isPlayerWonMicroBoard = function(board, id) {
  const moves = board.map((cell, index) => cell == id ? index : -1).filter((cell) => cell !== -1);
  return Game.WIN_COMBINATIONS.some((comb) => {
    return comb.filter((cell) => {
      return moves.includes(cell);
    }).length === 3;
  });
};

Game.prototype._initBoard = function () {
  this.mBoard = new Array(9);

  for (var i = 0; i < 9; i++) {
    this.mBoard[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }
};

Game.prototype._initMacroBoard = function () {
  this.mMacroboard = new Array(3);

  for (var i = 0; i < 3; i++) {
    this.mMacroboard[i] = [-1, -1, -1];
  }
};

Game.prototype.toString = function (array) {
  var r = '';
  for (var y = 0; y < array.length; y++) {
    for (var x = 0; x < array[y].length; x++) {
      r += array[x][y];
      if (x === array[y].length - 1) {
        r += '\n';
      } else {
        r += ',';
      }
    }
  }
  return r;
};

Game.WIN_COMBINATIONS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

module.exports = Game;