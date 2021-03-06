var bot,
  Bot,
  Solution = require('./Solution'),
  io = require('./io').init(process.argv[2]),
  Field = require('./Field'),
  processId = process.argv[3];



/**
 * Main class
 * Initializes a map instance and an empty settings object
 */
Bot = function () {

  if (false === (this instanceof Bot)) {
    return new Bot();
  }

  // initialize options object
  this.options = {};

  this.field = new Field();
};

/**
 *
 */
Bot.prototype.run = function () {


  io.recieve(function (data) {
    var line,
      lines,
      lineParts,
      command,
      response;

    // stop if line doesn't contain anything
    if (data.length === 0) {
      return;
    }
    console.log(`FROM SERVER TO BOT${processId}:\n${data}`);

    lines = data.trim().split('\n');

    while (0 < lines.length) {

      line = lines.shift().trim();
      lineParts = line.split(" ");

      // stop if lineParts doesn't contain anything
      if (lineParts.length === 0) {
        return;
      }

      // get the input command and convert to camel case
      command = lineParts.shift().toCamelCase();

      // invoke command if function exists and pass the data along
      // then return response if exists
      if (command in bot) {
        response = bot[command](lineParts);

        if (response && 0 < response.length) {
          io.send(response + '\n');
        }
      } else {
        io.error('Unable to execute command: ' + command + ', with data: ' + lineParts + '\n');
      }
    }
  });

  io.close(function () {
    process.exit(0);
  });
};

/**
 * Respond to settings command
 * @param Array data
 */
Bot.prototype.settings = function (data) {
  var key = data[0],
    value = data[1];

  // set key to value
  this.options[key] = value;
};

Bot.prototype.action = function (data) {
  const solution = new Solution();

  if (data[0] === 'move') {

    const moves = this.field.getAvailableMoves();

    const goodMove = solution.getMove(moves, this.field.mBoard, this.field.mMacroboard);
    const move = solution.getRandom(moves);

    return move.print();
  }
};

Bot.prototype.update = function (data) {

  // process.stderr.write(data);
  if (data[0] === 'game') {
    this.field.parseGameData(data[1], data[2]);
  }
};

String.prototype.toCamelCase = function () {

  return this.replace('/', '_').replace(/_[a-z]/g, function (match) {
    return match.toUpperCase().replace('_', '');
  });
};

/**
 * Initialize bot
 * __main__
 */
bot = new Bot();
bot.run();




// ignore
if (process.argv[2] !== 'DEV') {
  console.log = () => {};
}
io.send('connected');
