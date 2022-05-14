const fs = require('fs');
const path = require('path');

fs.readdir('03-files-in-folder/secret-folder',{withFileTypes: true}, (error, data) => {
  if (error) console.log(error);
  let allFiles = data;
  allFiles.forEach((item) => {
    if(item.isFile() === true) {
      let filePath = path.join(__dirname, 'secret-folder', item.name);
      let fileExtension = path.extname(filePath);
      let fileName = path.basename(filePath, path.extname(filePath));
      fs.stat(filePath, (error, date) => {
        if (error) console.log(error);
        console.log(fileName + ' - ' + fileExtension.slice(1) + ' - ' + date.size/1000 + 'kb');
      });
    }
  });
});