const path = require('path');
const fsp = require('fs/promises');



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

const createComponents = async (pathFromHTML) => {
  const components = {};
  let data = await fsp.readdir(pathFromHTML, {withFileTypes: true});
  for (let item of data) {
    if (path.extname(item.name) === '.html' && item.isFile()) {
      let name = item.name.split('.')[0];
      components[`${name}`] = await fsp.readFile(path.join(pathFromHTML, item.name), 'utf8');
    }
  }
  return components;
};

const changeTemplate = async (pathToHTML, comp) => {
  let htmlText = await fsp.readFile(pathToHTML, 'utf8');
  for (let key of Object.keys(comp)) {
    let reg = RegExp(`{{${key}}}`);
    htmlText = htmlText.replace(reg, comp[`${key}`]);
  }
  await fsp.writeFile(pathToHTML, htmlText);
};

const createStyleBundl = async (pathFromStyles, pathToStyles) => {
  let result = '';
  let filesArray = await fsp.readdir(path.join(pathFromStyles), {withFileTypes: true});
  filesArray = filesArray.filter(item => path.extname(item.name) === '.css' && item.isFile());
  for (let item of filesArray) {
    result += await fsp.readFile(path.join(pathFromStyles, item.name));
  }
  fsp.writeFile(pathToStyles, result);
};


const createIndexHTML = async () => {

  const pathToProject = path.join(__dirname, 'project-dist');
  const pathToAssets = path.join(pathToProject, 'assets');
  const pathToHTML = path.join(pathToProject, 'index.html');
  const pathToStyles = path.join(pathToProject, 'style.css');
  const pathToTemplate = path.join(__dirname, 'template.html');
  const pathFromAssets = path.join(__dirname, 'assets');
  const pathFromHTML = path.join(__dirname, 'components');
  const pathFromStyles = path.join(__dirname, 'styles');

  
  try {
    await clearDirectoryRecursive(pathToProject);
    console.log('Creating start');
  } catch (error) {
    console.log('Creating start');
  }

  await fsp.mkdir(pathToProject);

  try {
    await fsp.copyFile(pathToTemplate, pathToHTML);
    await changeTemplate(pathToHTML, await createComponents(pathFromHTML));
  } catch (error) {
    console.log('something wrong with input html files');
  }

  try {
    await createStyleBundl(pathFromStyles, pathToStyles);
  } catch (error) {
    console.log('something wrong with input css files');
  }

  try {
    await copyDirectoryRecursive(pathFromAssets, pathToAssets);
  } catch (error) {
    console.log('something wrong with assets directory');
  }
};

createIndexHTML();