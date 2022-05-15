const fs = require('fs');
const path = require('path');
const fsp = require('fs/promises');


async function createIndexHTML() {
  try {
    await fsp.unlink('./06-build-page/project-dist/index.html');
  } catch(error) {
    console.log('Существующий index.js не найден. Создаем новый.');
  }

  try {
    await fsp.rmdir('./06-build-page/project-dist/');
  } catch {
    console.log('Существующая папка project-dist не найдена. Создаем новую.');
  }

  await fsp.mkdir(path.join(__dirname, 'project-dist'))
    .then(fsp.copyFile('./06-build-page/template.html', './06-build-page/project-dist/index.html'))
    .catch(error => console.log(error.code));
}


const components = {};

async function createComponents() {
  await fsp.readdir(path.join(__dirname, 'components'))
    .then((data) => data.forEach((item) => {
      if (path.extname(item) === '.html') {
        createComp(item);
      }
    }));
}

async function createComp(item) {
  await fsp.readFile(path.join(__dirname, 'components', item))
    .then((data) => {
      components[`${item.split('.')[0]}`] = data.toString();
    });
}

async function template(comp) {
  let htmlText = await fsp.readFile('./06-build-page/project-dist/index.html');
  htmlText = htmlText.toString();
  Object.keys(comp).forEach((item) => {
    let reg = RegExp(`{{${item}}}`);
    htmlText = htmlText.replace(reg, components[`${item}`]);
  });
  await fsp.writeFile('./06-build-page/project-dist/index.html', htmlText);
}

async function creator() {
  await createIndexHTML();
  await createComponents();
  await template(components);
}

creator();