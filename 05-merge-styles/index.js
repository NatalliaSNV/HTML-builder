const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const os = require('os');

const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

fs.access(pathBundle, function(err) {
  if (err && err.code === 'ENOENT') {
    readWrite();
    //console.log('File isnt here');
    
  } else {
    fsPromises.rm(pathBundle, { recursive: true })
    .then(() => readWrite());
    //console.log('File here');
  }

  function readWrite() {
    fs.readdir(path.join(__dirname, 'styles'), 
      { withFileTypes: true },
      (err, files) => {
      if (err)
        console.log(err);
      else {
        const output = fs.createWriteStream(pathBundle);
        let numFiles = 0;
        files.forEach(file => {
          const pathToFile = path.join(__dirname, 'styles', file.name);
          if (path.extname(pathToFile) === '.css'){
            //console.log(path.parse(pathToFile).name);
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
          //console.log(numFiles);
        })
      }
    })
    
  }
})