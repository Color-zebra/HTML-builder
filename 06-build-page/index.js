const path = require('path');
const fsp = require('fs/promises');


async function clearDir(pathToProject, pathToAssets, pathToHTML, pathToStyles) {
  try {
    await fsp.unlink(pathToHTML);
  } catch(error) {
    console.log('Creating index.js');
  }

  try {
    await fsp.unlink(pathToStyles);
  } catch(error) {
    console.log('Creating style.css');
  }

  try {
    await fsp.rmdir(pathToProject);
  } catch {
    console.log('Creating project-dist directory');
  }
}

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
  const pathToStyles = path.join(pathToProject, 'styles.css');
  const pathToTemplate = path.join(__dirname, 'template.html');
  const pathFromAssets = path.join(__dirname, 'assets');
  const pathFromHTML = path.join(__dirname, 'components');
  const pathFromStyles = path.join(__dirname, 'styles');

  await clearDir(pathToProject, pathToAssets, pathToHTML, pathToStyles);
  await fsp.mkdir(pathToProject);
  await fsp.copyFile(pathToTemplate, pathToHTML);
  await changeTemplate(pathToHTML, await createComponents(pathFromHTML));
  await createStyleBundl(pathFromStyles, pathToStyles);
};

createIndexHTML();