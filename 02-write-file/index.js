const process = require('process');
const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const os = require('os');


const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write("Hello, enter some text! (If you don't see data in text.txt, update the file)" + os.EOL);
stdin.on('data', (data) => {
   if (data.toString().trim() === 'exit'){
    stdout.write('Good bye!' + os.EOL);
    process.exit();
   };
   output.write(data);
});
process.on('SIGINT', () => {
  stdout.write('Good bye!' + os.EOL);
  process.exit();
});



