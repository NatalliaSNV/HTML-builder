const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const dirFiles = path.join(__dirname, 'files');
const dirFilesCopy = path.join(__dirname, 'files-copy');

fs.readdir(dirFiles, 
  { withFileTypes: true },
  (err, files) => {
  if (err)
    console.log(err);
  else {
    fs.access(dirFilesCopy, function(err) {
      if (err && err.code === 'ENOENT') {
        createNewDir()
        .then(() => copyFiles());
        
      } else {
        fsPromises.rm(dirFilesCopy, { recursive: true })
        .then(() => createNewDir())
        .then(() => copyFiles())
      }

      function createNewDir() {
        return fsPromises.mkdir(dirFilesCopy, { recursive: true });
      }

      function copyFiles() {
        files.forEach(file => {
          const pathToFile = path.join(__dirname, 'files', file.name);
          const pathToFileNew = path.join(__dirname, 'files-copy', file.name);
          console.log(file.name);
          fsPromises.copyFile(pathToFile, pathToFileNew);
        }
        );
      }
    });
  }
})