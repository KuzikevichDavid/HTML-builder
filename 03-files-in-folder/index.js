import { opendir, lstat } from 'node:fs/promises'
import { parse } from 'node:path';

const path = './03-files-in-folder/secret-folder/';
const dir = await opendir(path);
for await (const dirent of dir) {
  if (dirent.isFile()) {
    const filePath = path + dirent.name
    const pathObj = parse(filePath);
    const stat = await lstat(filePath);
    console.log(`${pathObj.name} - ${pathObj.ext.slice(1)} - ${stat.size}`);
  }
}
