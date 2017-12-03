const readline = require('readline');
const io = readline.createInterface(process.stdin, process.stdout);


module.exports = {
  init: function (env) {
    return {
      recieve: function (cb) {
        if (env === 'DEV') {
          process.on('message', cb);
        } else {
          io.on('line', cb);
        }
      },
      send: function (data) {
        if (env === 'DEV') {
          process.send(data);
        } else {
          process.stdout.write(data);
        }
      },
      error: function (error) {
        process.stderr.write(error);
      },
      close: function (cb) {
        io.on('close', cb);
      }
    }
  }
};