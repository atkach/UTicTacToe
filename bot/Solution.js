(function () {

  Solution = function () {

  };

  Solution.prototype.getMove = function(availableMoves, mBoard, mMacroboard) {

  };

  Solution.prototype.getRandom = function(moves) {
    return moves[Math.floor(Math.random() * moves.length)];
  };

  module.exports = Solution;

})();