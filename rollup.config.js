import babelHelpers from 'babel-helpers';
import {
  getFileNameBody,
  getRelativePath
} from './scripts/pathUtil';
import {
  readFileAsync,
  templateAsync,
  execAsync,
  watchItr,
  glob
} from 'grimoirejs-build-env-base';

import {
  rollup
} from 'rollup';
import npm from 'rollup-plugin-node-resolve';
import builtin from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import sourcemaps from 'rollup-plugin-sourcemaps';
import chalk from 'chalk';
import generate from './scripts/generate-index';
import {
  argv
} from 'yargs';
import ProgressBar from 'progress';

const buildTask = () => {
  return new Promise((resolve, reject) => {
    rollup({
      entry: './lib/Grimoire.js',
      sourceMap: true,
      plugins: [
        sourcemaps(),
        builtin(),
        commonjs({
          ignoreGlobal: true,
          exclude: ["node_modules/rollup-plugin-node-builtins/**", "node_modules/rollup-plugin-node-globals/**"] // https://github.com/calvinmetcalf/rollup-plugin-node-builtins/issues/5
        }),
        npm({
          jsnext: true,
          main: true,
          browser: true
        }), globals()
      ]
    }).then(bundle => {
      resolve(bundle);
    }).catch(err => {
      reject(err);
    });
  });
};

const parseConfig = async() => {
  const config = JSON.parse(await readFileAsync("./package.json"));
  config.grimoire = config.grimoire ? config.grimoire : {};
  return config;
};

const tickBar = (bar, message) => {
  bar.fmt = `:percent[:bar](${message})\n`;
  bar.tick(4);
};

const main = async() => {
  const bar = new ProgressBar(':bar\nMoving files...\n', {
    total: argv.m ? 24 : 20
  });
  const config = await parseConfig();
  tickBar(bar, "Generating code from template...");
  await generate(config);
  tickBar(bar, "Compiling typescript files...");
  const tsResult = await execAsync("npm run compile");
  if (tsResult.err) {
    console.log(chalk.red(tsResult.stdout));
    return;
  }
  tickBar(bar, "Bundling es2016 javascript files...");
  let bundle = null;
  try {
    bundle = await buildTask();
  } catch (e) {
    console.error(chalk.white.bgRed("BUNDLING FAILED"));
    console.error(chalk.red(e));
    console.error(chalk.yellow(e.stack));
    return;
  }
  bundle.write({
    format: 'cjs',
    sourceMap: true,
    dest: './product/index.es2016.js'
  });
  tickBar(bar, "Transpiling into es2015 javascript files...");
  await execAsync("npm run babel");
  if (argv.m) {
    tickBar(bar, "Uglifying generated javascript");
    await execAsync("npm run minify");
  }
  tickBar(bar, "DONE!");
}

const task = async() => {
  if (!argv.w) await main();
  else {
    console.log(chalk.white.bgGreen("WATCH MODE ENABLED"));
    for (let changedChunk of watchItr("./src", {
        interval: 500
      })) {
      await changedChunk;
      console.log(chalk.black.bgWhite("Change was detected. Building was started."))
      await main();
    }
  }
}

const server = async() => {
  const serverLog = await execAsync("npm run serve");
  if (serverLog.err) {
    console.error(chalk.red(serverLog.stderr));
  }
}

task();
if (argv.s) {
  server();
}
