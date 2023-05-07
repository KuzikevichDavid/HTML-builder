import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

const read = async (outStream, path) => {
  try {
    return pipeline(createReadStream(path), outStream);
  } catch (err) {
    throw new Error('Operation failed');
  }
};

read(process.stdout, './01-read-file/text.txt');
