import { createInterface } from 'node:readline';
import { createWriteStream } from 'node:fs';
import os from 'node:os';

const main = async () => {
  try {
    process.once('exit', () => {
      console.log(`${os.EOL}Thank you for using Node.js, goodbye!`);
    });
    console.log('Welcome to the "Write file"!');

    const outStream = createWriteStream('02-write-file/02-write-file.txt');

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on('line', async (data) => {
      try {
        if (data) {
          switch (data) {
            case 'exit':
              outStream.close();
              process.exit();
              break;
            default:
              outStream.write(data + os.EOL);
              break;
          }
        }
      } catch (err) {
        console.log(err.message);
        outStream.close();
        process.exit();
      }
    });
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};

main();
