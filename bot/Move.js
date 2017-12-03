
(function () {

  Move = function (x, y) {

    this.x = x;
    this.y = y;
  };

  Move.prototype.print = function () {
    return "place_move " + this.x + ' ' + this.y;
  };

  module.exports = Move;

})();