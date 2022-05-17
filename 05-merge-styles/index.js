const fsp = require('fs/promises');
const path = require('path');

const pathFrom = path.join(__dirname, 'styles');
const pathTo = path.join(__dirname, 'project-dist', 'bundle.css');


const clearDirectory = async (pathTo) => {
  try {
    await fsp.unlink(pathTo);
    console.log('refreshing bundle');
  } catch (error) {
    console.log('creating bundle');
  }
};

const createBundls = async (pathFrom, pathTo) => {
  await clearDirectory();
  let result = '';
  let filesArray = await fsp.readdir(path.join(pathFrom), {withFileTypes: true});
  filesArray = filesArray.filter(item => path.extname(item.name) === '.css' && item.isFile());
  for (let item of filesArray) {
    result += await fsp.readFile(path.join(pathFrom, item.name));
  }
  fsp.writeFile(pathTo, result);
};

createBundls(pathFrom, pathTo);