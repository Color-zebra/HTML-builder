const fsp = require('fs/promises');
const path = require('path');


const pathTo = path.join(__dirname, 'files-copy');
const pathFrom = path.join(__dirname, 'files');


const clearDirectory = async (pathTo) => {
  try {
    let filesForDelete = await fsp.readdir(pathTo);
    for (let item of filesForDelete) {
      await fsp.unlink(path.join(pathTo, item));
    }
    await fsp.rmdir(pathTo);
    console.log('Target directory is cleaned');
  } catch (error) {
    console.log('Target directory is clear');
  }
};

const copyDirectory = async (pathFrom, pathTo) => {
  await clearDirectory(pathTo);
  await fsp.mkdir(pathTo);
  const filesForCopy = await fsp.readdir(pathFrom);
  for (let file of filesForCopy) {
    await fsp.copyFile(path.join(pathFrom, file), path.join(pathTo, file));
  }
  console.log('All files copied');
};

copyDirectory(pathFrom, pathTo);
