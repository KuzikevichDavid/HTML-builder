import { createReadStream, createWriteStream } from 'node:fs';
import { opendir, open, mkdir } from 'node:fs/promises';
import { finished, pipeline } from 'node:stream/promises';
import { parse } from 'node:path';
import os from 'node:os';

const copyFile = async (src, dest) => {
  try {
    pipeline(createReadStream(src), createWriteStream(dest));
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

const findFiles = async (path, ext, resArr) => {
  const dir = await opendir(path);
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      const filePath = path + dirent.name;
      const pathObj = parse(filePath);
      pathObj.fullPath = filePath;
      if (pathObj.ext === ext) {
        resArr.push(pathObj);
      }
    }
  }
};

const mergeStyles = async () => {
  const files = [];

  const [path, ext] = ['./06-build-page/styles/', '.css'];
  await findFiles(path, ext, files);

  const outStream = createWriteStream('./06-build-page/project-dist/style.css');
  for (let i = 0; i < files.length; i += 1) {
    const stream = createReadStream(files[i].fullPath);
    stream.pipe(outStream, { end: false });
    await finished(stream);
  }

  outStream.end();
  await finished(outStream);
};

const appendShablon = async () => {
  const [symbolsStart, symbolsEnd] = ['{{', '}}'];
  const templateExt = '.html';
  const outStream = createWriteStream(
    './06-build-page/project-dist/index.html',
  );
  const file = await open('./06-build-page/template.html');
  const files = [];
  await findFiles('./06-build-page/components/', templateExt, files);

  for await (const line of file.readLines()) {
    const start = line.indexOf(symbolsStart) + symbolsStart.length;
    const end = line.indexOf(symbolsEnd, start);
    if (start !== -1 && end !== -1) {
      const templateName = line.slice(start, end);
      const idx = files.findIndex((x) => x.name === templateName);
      if (idx !== -1) {
        const template = createReadStream(files[idx].fullPath);
        template.pipe(outStream, { end: false });
        await finished(template);
        outStream.write(os.EOL);
      } else {
        outStream.end();
        throw new Error(
          `Template file ${templateName + templateExt} not found`,
        );
      }
    } else {
      outStream.write(line + os.EOL);
    }
  }
};

await copyDir(
  './06-build-page/assets/',
  './06-build-page/project-dist/assets/',
);

mergeStyles();

appendShablon();
