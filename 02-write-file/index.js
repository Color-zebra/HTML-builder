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

const endlessInput = (text) => {
  rl.question(text, (date) => {
    if (date === 'exit') {
      process.exit();
    } else {
      writeStream.write(date + '\n');
      endlessInput('Ожидается дальнейший ввод. Для остановки ввода нажите сочетание Ctrl + C, или наберите \'exit\'\n');
    }
  });
};

endlessInput('Все что ты скажешь будет записано и использовано против тебя!\n');


