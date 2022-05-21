const path = require('path');
const fsp = require('fs/promises');


const pathTo = path.join(__dirname, 'secret-folder');


const filesInFolder = async (pathTo) => {
  let allFilesInFolder = await fsp.readdir(pathTo, {withFileTypes: true});
  for (let file of allFilesInFolder) {
    if (file.isFile()) {
      let slicedFileName = file.name.split('.');
      let fileStat = await fsp.stat(path.join(pathTo, file.name));
      console.log(slicedFileName[0], '-', slicedFileName[slicedFileName.length-1], '-', fileStat.size + ' bytes');
    }
  }
};

filesInFolder(pathTo);