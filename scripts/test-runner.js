import {
  argv
} from 'yargs';
import {
  execAsync,
  readFileAsync,
  watchItr,
  copyDirAsync
} from 'grimoirejs-build-env-base';
import generator from './generate-index';
import Progress from 'progress';
import chalk from 'chalk';
import txt2js from './txt2js';
import path from 'path';
const test = async() => {
  if (argv.c) {
    await execAsync("npm run babel-ci-test .S ./test/${}")
  }
  const result = await execAsync(`npm run ava --　- S ./lib-test/${argv.f?argv.f:"**/*Test.js"}`);
  console.log(result.stdout);
  console.log(result.stderr);
  if (result.err) {
    console.error(result.stderr);
  }
};

const tickProgress = (bar, message, tick) => {
  bar.fmt = `:percent[:bar](${message})\n`;
  bar.tick(tick);
};

const main = async() => {
  const bar = new Progress('', {
    total: 24
  });
  tickProgress(bar, "Generating code from template...", 0);
  const config = JSON.parse(await readFileAsync("./package.json"));
  config.grimoire = config.grimoire ? config.grimoire : {};
  if (config.grimoire.txt2js) {
    const exts = config.grimoire.txt2js;
    for (var i = 0; i < exts.length; i++) {
      await txt2js("./test/**/" + exts[i], 'lib-test', 'test', true,true);
    }
  }
  await copyDirAsync('test', 'lib-test', true, (c)=>{
    return path.extname(c) === ".js" || path.extname(c) === "";
  });
  await generator(config);
  tickProgress(bar, "Compiling typescript...", 8);
  const tsResult = await execAsync("npm run compile");
  if (tsResult.err) {
    console.error(tsResult.stderr);
    return;
  }
  tickProgress(bar, "Transpiling ES6 to ES5...", 8);
  const babelResult = await execAsync("npm run babel-test");
  if (babelResult.err) {
    console.error(babelResult.stderr);
    return;
  }
  tickProgress(bar, "DONE! Now lets start test!", 8);
  await test();
};

const watchSrc = async() => {
  for (let changedChunk of watchItr("./src", {
      interval: 500
    })) {
    await changedChunk;
    console.log(chalk.black.bgWhite("Change was detected. Building was started."))
    await main();
  }
}

const watchTest = async() => {
  for (let changedChunk of watchItr("./test", {
      interval: 500
    })) {
    await changedChunk;
    console.log("test was changed");
    await test();
  }
};

const task = async() => {
  if (!argv.w) {
    main();
  } else {
    watchSrc();
    watchTest();
  }
};

task();
