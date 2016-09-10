import {
  copyDirAsync,
  readFileAsync,
  writeFileAsync,
  templateAsync,
  unlinkAsync,
  execAsync,
  emptyDir,
  glob
} from 'grimoirejs-build-env-base';
import {
  getFileNameBody,
  getRelativePath
} from './pathUtil';
import txt2js from './txt2js';


export default async function(config) {
  await copyDirAsync('./src', './lib-ts', true);
  const files = await glob('./lib-ts/**/*.ts');
  await writeFileAsync('./lib-ts/entry_files', files.join('\n'));
  if (config.grimoire.txt2js) {
    const exts = config.grimoire.txt2js;
    for (var i = 0; i < exts.length; i++) {
      await txt2js("./src/**/" + exts[i], 'lib', 'src');
    }
  }
}
