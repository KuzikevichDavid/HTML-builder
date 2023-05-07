import { opendir } from 'node:fs/promises';
import { parse } from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { finished } from 'node:stream/promises';

const outStream = createWriteStream(
  './05-merge-styles/project-dist/bundle.css',
);

const path = './05-merge-styles/styles/';
const dir = await opendir(path);
for await (const dirent of dir) {
  if (dirent.isFile()) {
    const filePath = path + dirent.name;
    const pathObj = parse(filePath);
    if (pathObj.ext === '.css') {
      const stream = createReadStream(filePath);
      stream.pipe(outStream, { end: false });
      await finished(stream);
    }
  }
}

outStream.end();
