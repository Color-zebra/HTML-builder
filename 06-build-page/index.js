const fs = require('fs');
const path = require('path');


const components = {};


fs.readdir(path.join(__dirname, 'components'), (error, data) => {
  data.forEach((item) => {
    fs.readFile(path.join(__dirname, 'components', item), (error, data) => {
      components[`${item}`] = data.toString();
      createIndex();
    });
  });
});

const createIndex = () => {
  fs.readFile('./06-build-page/project-dist/index.html', (error, data) => {
    Object.keys(components).forEach((item) => {
      item = item.split('.')[0];
      console.log(item);
      let reg = RegExp(`{{${item}}}`);
      console.log(reg);
      console.log(components);
      data = data.toString().replace(reg, components[`${item}.html`]);
      fs.writeFile('./06-build-page/project-dist/index.html', data, () => {});
    });
    console.log(data);
/*     data = data.toString().replace(/{{/g, path.join(__dirname, 'components'));
    data = data.toString().replace(/}}/g, '.html');
    console.log(data.toString()); */
    
  });
};

const createPage = () => {
  fs.mkdir(path.join(__dirname, 'project-dist'), () => {
  });
  fs.copyFile('./06-build-page/template.html', './06-build-page/project-dist/index.html', (error, data) => {
/*     let readStream = fs.createReadStream('./06-build-page/project-dist/index.html');
    let writeStream = fs.createWriteStream('./06-build-page/project-dist/index.html');
    readStream.on('data', (chunk) => {
    }) */
  });
};

createPage();