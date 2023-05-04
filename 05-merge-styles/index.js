import { opendir } from 'node:fs/promises'
import { parse } from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';

const files = [];
let curFile = 0;
const outStream = createWriteStream('./05-merge-styles/project-dist/bundle.css');

const writeNext = () => {
  const stream = createReadStream(files[curFile]);
  stream.once('end', onEnd);
  stream.pipe(outStream, { end: false });
}

const onEnd = () => {
  if (curFile < files.length) {
    writeNext();
    curFile += 1;
  } else {
    outStream.end();
  }
};

const path = './05-merge-styles/styles/';
const dir = await opendir(path);
for await (const dirent of dir) {
  if (dirent.isFile()) {
    const filePath = path + dirent.name;
    const pathObj = parse(filePath);
    if (pathObj.ext === '.css') {
      files.push(filePath);
    }
  }
}

writeNext();