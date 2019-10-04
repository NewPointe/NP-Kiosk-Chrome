/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { FSWatcher } from 'fs';

import gulp from 'gulp';
import del from 'del';
import sourcemaps from 'gulp-sourcemaps';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import named from 'vinyl-named';
import gulp_sass from 'gulp-sass';
import node_sass from 'node-sass';
import gulp_zip from 'gulp-zip';

import webpackConfig from './webpack.config';

(gulp_sass as any).compiler = node_sass;

const fsWatchers: { watcher: FSWatcher, callback: () => void }[] = [];

process.on("SIGINT", function () {
    fsWatchers.forEach(w => {
        w.watcher.close();
        w.callback();
    });
    process.exit();
});

export function clean() {
    return del("./dist");
}

function compile_typescript(watch = false) {
    return gulp.src([
        "./src/scripts/application.ts",
        "./src/scripts/background.ts",
        "./src/scripts/client-api-injector.ts",
        "./src/scripts/client-api.ts"
    ])
    .pipe(named())
    .pipe(webpackStream({ watch, ...webpackConfig }, webpack as any))
    .pipe(gulp.dest('dist/scripts/'));
}
export function typescript() {
    return compile_typescript(false);
}

export function sass() {
    return gulp.src("./src/styles/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(gulp_sass().on("error", gulp_sass.logError))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/styles"));
}

export function copy() {
    return gulp.src(["./public/**/*"])
        .pipe(gulp.dest("./dist"));
}

export function packageapp() {
    return gulp.src("./dist/**/*")
        .pipe(gulp_zip('archive.zip'))
        .pipe(gulp.dest('./'));
}

export function watch_typescript() {
    return compile_typescript(true);
}

export function watch_sass(callback: () => void) {
    fsWatchers.push({ watcher: gulp.watch("./src/styles/**/*.scss", sass), callback });
}

export function watch_copy(callback: () => void) {
    fsWatchers.push({ watcher: gulp.watch("./public/**/*", copy), callback });
}

export const watch = gulp.parallel(watch_sass, watch_typescript, watch_copy);

export const build = gulp.parallel(sass, typescript);

export default gulp.series(clean, copy, build, packageapp);
