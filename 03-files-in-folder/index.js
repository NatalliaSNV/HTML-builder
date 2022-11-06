const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), 
  { withFileTypes: true },
  (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if (file.isFile()){
        const pathToFile = path.join(__dirname, 'secret-folder', file.name);
        fs.stat(pathToFile, (err, stats) => {
          if (err) throw err;
          console.log(path.parse(pathToFile).name + " - " + path.extname(pathToFile).slice(1) + " - " + stats.size + " bytes");
        });
      }
      
    })
  }
})

