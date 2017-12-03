// Copyright 2016 TheAIGames.com

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

(function () {

  var Move = require('./Move');

  var Field = function () {

    this.mBoard = [];
    this.mMacroboard = [];
    this.ROWS = 9;
    this.COLS = 9;

    this.constructBoard();
    this.constructMacroBoard();
  };


  Field.prototype.constructBoard = function () {
    this.mBoard = new Array(9);

    for (var i = 0; i < 9; i++) {
      this.mBoard[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
  };

  Field.prototype.constructMacroBoard = function () {
    this.mMacroboard = new Array(3);

    for (var i = 0; i < 3; i++) {
      this.mMacroboard[i] = [0, 0, 0];
    }
  };

  Field.prototype.parseGameData = function (key, value) {

    if (key === 'round') {
      this.mRoundNr = Number(value);
    }
    if (key === 'move') {
      this.mMoveNr = Number(value);
    }
    if (key === 'field') {
      this.parseBoardFromString(value);
    }
    if (key === 'macroboard') {
      this.parseMacroboardFromString(value);
    }
  };

  Field.prototype.parseBoardFromString = function (s) {
    var s = s.replace(';', ',');
    var r = s.split(',');
    var counter = 0;
    for (var y = 0; y < this.ROWS; y++) {
      for (var x = 0; x < this.COLS; x++) {
        this.mBoard[x][y] = Number(r[counter]);
        counter++;
      }
    }
  };

  Field.prototype.parseMacroboardFromString = function (s) {

    var r = s.split(','),
      counter = 0;

    for (var y = 0; y < 3; y++) {
      for (var x = 0; x < 3; x++) {
        this.mMacroboard[x][y] = Number(r[counter]);
        counter++;
      }
    }
  };

  Field.prototype.getAvailableMoves = function () {

    var moves = [];

    for (var y = 0; y < this.ROWS; y++) {
      for (var x = 0; x < this.COLS; x++) {
        var macroY = Math.floor(y / 3);
        var macroX = Math.floor(x / 3);
        if (this.mBoard[x][y] === 0 && this.mMacroboard[macroX][macroY] < 0) {
          moves.push(new Move(x, y));
        }
      }
    }
    return moves;
  };

  Field.prototype.toString = function (array) {
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

  module.exports = Field;

})();