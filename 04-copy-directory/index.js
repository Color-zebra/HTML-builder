const fsp = require('fs/promises');
const path = require('path');


const pathTo = path.join(__dirname, 'files-copy');
const pathFrom = path.join(__dirname, 'files');


const clearDirectoryRecursive = async (pathTo) => {
  let filesInFolder = await fsp.readdir(pathTo, {withFileTypes: true});
  if (filesInFolder.length === 0) {
    await fsp.rmdir(pathTo);
    return;
  }
  for (let item of filesInFolder) {
    if (item.isFile()) {
      await fsp.unlink(path.join(pathTo, item.name));
    }
    if (item.isDirectory()) {
      await clearDirectoryRecursive(path.join(pathTo, item.name));
    }
  }
  await fsp.rmdir(pathTo);
  return;
};

const copyDirectoryRecursive = async (pathFrom, pathTo) => {
  let filesInFolder = await fsp.readdir(pathFrom, {withFileTypes: true});
  await fsp.mkdir(pathTo);
  for (let item of filesInFolder) {
    if (item.isFile()) {
      await fsp.copyFile(path.join(pathFrom, item.name), path.join(pathTo, item.name));
    }
    if (item.isDirectory()) {
      await copyDirectoryRecursive(path.join(pathFrom, item.name), path.join(pathTo, item.name));
    }
  }
  return;
};

const copy = async (pathFrom, pathTo) => {
  try {
    await clearDirectoryRecursive(pathTo);
    console.log('Copying start');
  } catch (error) {
    console.log('Copying start');
  }
  try {
    await copyDirectoryRecursive(pathFrom, pathTo);
    console.log('Copying succesfull');
  } catch (error) {
    console.log('Something wrong with directory which copying');
  }
};

copy(pathFrom, pathTo);