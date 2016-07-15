import _ from 'lodash';
import args from 'yargs';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import cache from 'gulp-cached';
import debug from 'gulp-debug';
import del from 'del';
import es from 'gulp-babel';
import fs from 'fs';
import globArray from 'glob-array';
import gulp from 'gulp';
import gutil from 'gulp-util';
import path from 'path';
import ptime from 'pretty-hrtime';
import runSequence from 'run-sequence';
import source from 'vinyl-source-stream';
import sourcemap from 'gulp-sourcemaps';
import ts from 'gulp-typescript';
import tslint from 'gulp-tslint';
import txtjs from 'gulp-txtjs';
import typedoc from 'gulp-typedoc';
import watchify from 'watchify';
import exec from 'gulp-exec';

gulp.task('default', ['build']);

gulp.task('build-all', ['build', 'build-test']);

/**
 * build gr.js
 */
gulp.task('build', () => {
    runSequence(['ts-es6'], ['copy-json', 'txt-es5', 'es6-es5'], 'bundle');
});

/**
 * build test
 */
gulp.task('build-test', ['test-txt-es5', 'test-es6-es5']);

/**
 * watch
 */
gulp.task('watch', () => {
    enableWatch();
    runSequence('build');
});

let watching = false;

function enableWatch() {
    watching = true;
    gutil.log(gutil.colors.green('Watch Mode Enabled'));
}
if (args.argv.watch || args.argv.w) {
    enableWatch();
}

/**
 * Transpile ts to es6
 */
const tsProject = ts.createProject('tsconfig.json', {
    noExternalResolve: true
});
gulp.task('ts-es6', () => {
    const entry = './src/**/*.ts';
    const dest = './lib';
    if (watching) {
        gulp.watch(entry, ['ts-es6']);
    }
    return gulp
        .src(entry)
        .pipe(sourcemap.init())
        .pipe(ts(tsProject))
        .js
        .pipe(cache('ts'))
        .pipe(sourcemap.write())
        .pipe(debug({
            title: 'Compiling ts'
        }))
        .pipe(gulp.dest(dest));
});

/**
 * Expose text file to js modules
 */
gulp.task('txt-es5', () => {
    const entryExtensions = ['.html', '.css', '.glsl', '.xmml', '.rsml', '.xml'];
    const entry = entryExtensions.map((ext) => `./src/**/*${ext}`);
    const dest = './lib-es5';
    if (watching) {
        gulp.watch(entry, ['txt-es5']);
    }
    return txtToEs5(entry, dest);
});

gulp.task('test-txt-es5', () => {
    const entryExtensions = ['.html', '.css', '.glsl', '.xmml', '.rsml', '.xml'];
    const entry = entryExtensions.map((ext) => `./test/**/*${ext}`);
    const dest = './test-es5';
    if (watching) {
        gulp.watch(entry, ['test-txt-es5']);
    }
    return txtToEs5(entry, dest);
});

function txtToEs5(entry, dest) {
    return gulp
        .src(entry)
        .pipe(cache('txt'))
        .pipe(txtjs())
        .pipe(debug({
            title: 'Compiling txt'
        }))
        .pipe(gulp.dest(dest));
}

/**
 * Copy
 */
gulp.task('copy-json', () => {
    const entry = './src/**/*.json';
    const dest = './lib-es5';
    if (watching) {
        gulp.watch(entry, ['copy-json']);
    }
    return copy(entry, dest);
});

function copy(entry, dest) {
    return gulp
        .src(entry)
        .pipe(debug({
            title: 'Copying'
        }))
        .pipe(gulp.dest(dest));
}

/**
 * Transpile es6 to es5
 */
gulp.task('es6-es5', () => {
    const entry = './lib/**/*.js';
    const dest = './lib-es5';
    if (watching) {
        gulp.watch(entry, ['es6-es5']);
    }
    return es6to5(entry, dest);
});

gulp.task('test-es6-es5', () => {
    const entry = './test/**/*.js';
    const dest = './test-es5';
    if (watching) {
        gulp.watch(entry, ['test-es6-es5']);
    }
    return es6to5(entry, dest);
});

function es6to5(entry, dest) {
    return gulp
        .src(entry)
        .pipe(cache('es'))
        .pipe(sourcemap.init({
            loadMaps: true
        }))
        .pipe(es())
        .pipe(sourcemap.write())
        .pipe(debug({
            title: 'Compiling es'
        }))
        .pipe(gulp.dest(dest));
}

/**
 * bundle with browserify
 */
gulp.task('bundle', () => {
    const entry = './lib-es5/Grimoire.js';
    const dest = './product';
    const opt = {
        entries: entry,
        debug: true,
        cache: {},
        packageCache: {},
    };
    const b = browserify(opt);
    if (watching) {
        b.plugin(watchify, {
            delay: 100,
            ignoreWatch: ['**/node_modules/**'],
        });
    }

    function bundle() {
        const time = process.hrtime();
        gutil.log('Bundling...');
        return b
            .bundle()
            .pipe(source('gr.js'))
            .pipe(buffer())
            .pipe(sourcemap.init({
                loadMaps: true
            }))
            .pipe(sourcemap.write('./'))
            .pipe(gulp.dest(dest))
            .on('end', () => {
                gutil.log('Finished bundling ' + gutil.colors.magenta(ptime(process.hrtime(time))));
            });
    }
    if (watching) {
        b.on('update', bundle);
    }
    return bundle();
});

/**
 * doc
 */
gulp.task('doc', () => {
    const entry = './src/**/*.ts';
    const dest = 'ci/docs';
    const branch = args.argv.branch;
    const outPath =  path.join(dest, branch || 'unknown');
    const jsonPath = path.join(dest, `${branch}.json`);
    return gulp.src('./')
        .pipe(exec(`typedoc --out ${outPath} --json ${jsonPath} --name Grimoire --target es6 ${entry}`));
});

/**
 * lint
 */
gulp.task('lint-ts', () => {
    const entry = ['!./src/typings/**/*.ts', './src/**/*.ts', '!./src/refs/**/*.ts', '!./src/bundle-notdoc.ts'];
    gulp
        .src(entry)
        .pipe(tslint({
            configuration: './tslint.json',
            rulesDirectory: './lint/rules/',
        }))
        .pipe(tslint.report('verbose'));
});

/**
 * tsconfig
 */
gulp.task('tscfg', () => {
    const entry = './tsconfig.json';
    const json = JSON.parse(fs.readFileSync(entry));
    const files = _(globArray.sync(json.filesGlob)).uniq(true);
    json.files = files;
    fs.writeFileSync(entry, JSON.stringify(json, null, 2));
});

/**
 * clean
 */
gulp.task('clean', () => {
    const temp = ['./product/gr.js', './product/gr.js.map', './src/**/*.js', './lib', './lib-es5', './test-es5', './coverage', './ci'];
    del(temp).then((paths) => {
        paths.forEach((p) => gutil.log(`deleted: \"${p}\"`));
    });
});
