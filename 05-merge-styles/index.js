const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream('./05-merge-styles/project-dist/bundle.css');

const createBundl = () => {
  fs.readdir(path.join(__dirname, 'styles'), (error, filesCollection) => {
    filesCollection.forEach((item) => {
      if (path.extname('./05-merge-styles/styles/' + item) === '.css') {
        let readStream = fs.createReadStream('./05-merge-styles/styles/' + item);
        readStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });
      }
    });
  });
};

createBundl();