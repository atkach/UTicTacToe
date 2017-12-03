const {fork} = require('child_process');
const Game = require('./Game');

const bot1 = fork('./bot/BotStarter.js', ['DEV', '1']);
const bot2 = fork('./bot/BotStarter.js', ['DEV', '2']);

bot1.on('message', (m) => {
  console.log('FROM **bot1** TO SERVER:', m);
  if (m === 'connected') {
    game.initBot(bot1, 1);
  } else {
    game.recieveMove(1, m);
  }
});

bot2.on('message', (m) => {
  console.log('FROM **bot2** TO SERVER:', m);
  if (m === 'connected') {
    game.initBot(bot2, 2);
  } else {
    game.recieveMove(2, m);
  }
});


const game = new Game();
setTimeout(() => {game.start();}, 1000);
game.onFinish(() => {
  process.exit();
});
