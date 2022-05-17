//const fs = require('fs');
const path = require('path');
const fsp = require('fs/promises');


const components = {};


async function createComponents() {
  let data = await fsp.readdir(path.join(__dirname, 'components'));
  //console.log(data);
  //console.log(Array.isArray(data));
  for (let i = 0; i < data.length; i++) {
    if (path.extname(data[i]) === '.html') {
      //console.log('Создаем шаблон для:', data[i]);
      components[`${data[i].split('.')[0]}`] = await fsp.readFile(path.join(__dirname, 'components', data[i]), 'utf8');
      //console.log('Шаблон создан', components[`${data[i].split('.')[0]}`]);
    }
  }
}

async function changeTemplate(comp) {
  let htmlText = await fsp.readFile('./06-build-page/project-dist/index.html');
  htmlText = htmlText.toString();
  for (let key of Object.keys(comp)) {
    let reg = RegExp(`{{${key}}}`);
    htmlText = htmlText.replace(reg, comp[`${key}`]);
  }
  await fsp.writeFile('./06-build-page/project-dist/index.html', htmlText);
}

async function clearDir() {
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
}

async function createIndexHTML() {
/*   try {
    await fsp.unlink('./06-build-page/project-dist/index.html');
  } catch(error) {
    console.log('Существующий index.js не найден. Создаем новый.');
  }

  try {
    await fsp.rmdir('./06-build-page/project-dist/');
  } catch {
    console.log('Существующая папка project-dist не найдена. Создаем новую.');
  } */

  await clearDir();

  fsp.mkdir(path.join(__dirname, 'project-dist'))
    .then(fsp.copyFile('./06-build-page/template.html', './06-build-page/project-dist/index.html'))
    .then(() => {
      createComponents()
        .then(() => changeTemplate(components))
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
}

createIndexHTML();