const fs = require('fs');
const path = require('path');


const copyFiles = () => {
  fs.mkdir(`${__dirname}/files-copy`, () => {
    fs.readdir(`${__dirname}/files`, (error, data) => {
      if (error) throw new Error('Чет сломалось');
      data.forEach((item) => {
        let fileCurrentPath = path.join(__dirname, 'files', item);
        let fileTargetPath = path.join(__dirname, '/files-copy', item);
        fs.copyFile(fileCurrentPath, fileTargetPath, () => {});
      });
    });
  });
};

const copyFilesAfterCleaning = () => {
  fs.readdir(path.join(__dirname, '/files-copy'), (error, data) => {
    if (error) console.log('Something break...');
    data.forEach((item) => {
      let filePath = path.join(__dirname, '/files-copy', item);
      fs.unlink(filePath, () => {});
      fs.rmdir(path.join(__dirname, '/files-copy'), () => {copyFiles();});
    });
  });
};

const copyDir = () => {
  fs.stat(`${__dirname}/files-copy`, (error) => {
    if (error) {
      copyFiles();
    } else {
      copyFilesAfterCleaning();
    }
  });
};

copyDir();
