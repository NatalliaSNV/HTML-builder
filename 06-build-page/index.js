const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const os = require('os');

const pathProjectDist = path.join(__dirname, 'project-dist');
const pathStyle = path.join(__dirname, 'project-dist', 'style.css');

console.log('Hello, please, in case an error appears then try runnig the command from Command Prompt(cmd) or Git Bash');

fs.access(pathProjectDist, function(err) {
  if (err && err.code === 'ENOENT') {
    createNewDir()
    .then(() => createIndexJs())
    .then(() => readWrite())
    .then(() => copyAssets());
    console.log("New");
    
  } else {
    fsPromises.rm(path.join(__dirname, 'project-dist', 'assets', 'svg'), { recursive: true, force: true })
    .then(() => fsPromises.rm(path.join(__dirname, 'project-dist', 'assets', 'fonts'), { recursive: true, force: true}))
    .then(() => fsPromises.rm(path.join(__dirname, 'project-dist', 'assets', 'img'), { recursive: true, force: true}))
    .then(() => fsPromises.rm(path.join(__dirname, 'project-dist', 'assets'), { recursive: true, force: true}))
    .then(() => fsPromises.rm(pathProjectDist, { recursive: true}))
    .then(() => createNewDir())
    .then(() => createIndexJs())
    .then(() => readWrite())
    .then(() => copyAssets())
    .catch((err) => {console.log(err)});
    console.log("Remove and New");
  }

  function createNewDir() {
    console.log('createnewdirrrrrr');
    return fsPromises.mkdir(pathProjectDist, { recursive: true });
  }

  function createIndexJs(){
    console.log('createIndexJs');
    const stream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');

    let data = '';

    stream.on('data', chunk => data += chunk);

    stream.on('end', () => {
    fs.readdir(path.join(__dirname, 'components'), 
          { withFileTypes: true },
          (err, files) => {     
          if (err)
            console.log(err);
          else {
            const arrayHtmlInCompanents = [];
            files.forEach(file => {
              const pathToFile = path.join(__dirname, 'components', file.name);
              if (path.extname(pathToFile) === '.html'){
                arrayHtmlInCompanents.push(path.parse(pathToFile).name);
              }        
            })
            let newData = data;
            //console.log(newD);
            for (let i = 0; i < arrayHtmlInCompanents.length; i++){
              if (data.includes(arrayHtmlInCompanents[i])){
                const streamTempl = fs.createReadStream(path.join(__dirname, 'components', arrayHtmlInCompanents[i] + '.html'), 'utf-8');
                //console.log(path.join(__dirname, 'components', arrayHtmlInCompanents[i] + '.html'));
                let templateFile = '';
                streamTempl.on('data', chunk => templateFile += chunk);
                streamTempl.on('end', () => {
                  newData = newData.replace('{{' + arrayHtmlInCompanents[i] + '}}', templateFile);
                  const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
                  output.write(newData);
                });
              }
            }
          }    
      })
    });
  }

  function readWrite() {
    console.log('readWrite');
    fs.readdir(path.join(__dirname, 'styles'), 
      { withFileTypes: true },
      (err, files) => {
      if (err)
        console.log(err);
      else {
        const output = fs.createWriteStream(pathStyle);
        let numFiles = 0;
        files.forEach(file => {
          const pathToFile = path.join(__dirname, 'styles', file.name);
          if (path.extname(pathToFile) === '.css'){
            const input = fs.createReadStream(pathToFile, 'utf-8');
            if (numFiles !== 0){
              input.on('data', chunk => {
                output.write(os.EOL);
                output.write(os.EOL);
                output.write(chunk);
              });
            }
            else {
              input.on('data', chunk => {
                output.write(chunk);
              });
            }
            input.on('error', error => console.log('Error', error.message));
          }  
          numFiles = numFiles + 1;
        })
      }
    })
    
  }

 function copyAssets(){
  console.log('assets');
  fs.readdir(path.join(__dirname, 'assets'), 
    { withFileTypes: true },
    (err, files) => {
    if (err)
      console.log(err);
    else {
      //console.log(files);
      fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });
      files.forEach(file => {
        if (file.isDirectory){
          //console.log('true');
          fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets', file.name), { recursive: true });
          copyFiles(file.name);
        }
      })

      function copyFiles(direct) {
        fs.readdir(path.join(__dirname, 'assets', direct), 
        { withFileTypes: true },
        (err, files) => {
        if (err)
          console.log(err);
        else {
          files.forEach(file => {
            const pathToFile = path.join(__dirname, 'assets', direct, file.name);
            const pathToFileNew = path.join(__dirname, 'project-dist', 'assets', direct, file.name);
            //console.log(pathToFileNew);
            //console.log(file.name);
            fsPromises.copyFile(pathToFile, pathToFileNew);
          })
        }
      })
      }
    }
  })
 }

})