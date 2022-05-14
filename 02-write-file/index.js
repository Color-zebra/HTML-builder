const readline = require('readline');
const fs = require('fs');

const writeStream = fs.createWriteStream('./02-write-file/result.txt');
const rl = readline.createInterface(
  {
    input: process.stdin,
    output: process.stdout
  }
);

process.on('exit', () => {
  console.log('Успехов в учебе! Пока!');
  writeStream.end('');
  rl.close;
});

const endlessInput = () => {
  rl.question('Все что ты скажешь будет записано и использовано против тебя!\n', (date) => {
    if (date === 'exit') {
      process.exit();
    } else {
      writeStream.write(date + '\n');
      endlessInput();
    }
  });
};

endlessInput();


