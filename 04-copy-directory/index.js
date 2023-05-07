import { createReadStream, createWriteStream } from 'node:fs';
import { opendir, mkdir } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';

const copyFile = async (src, dest) => {
  try {
    return pipeline(createReadStream(src), createWriteStream(dest));
  } catch (err) {
    console.error(err);
  }
};

const copyDir = async (srcPath, destPath) => {
  await mkdir(destPath, { recursive: true });
  const dir = await opendir(srcPath);
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      copyFile(srcPath + dirent.name, destPath + dirent.name);
    } else if (dirent.isDirectory()) {
      copyDir(`${srcPath + dirent.name}/`, `${destPath + dirent.name}/`);
    }
  }
};

copyDir('./04-copy-directory/files/', './04-copy-directory/files-copy/');
