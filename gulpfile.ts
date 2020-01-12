/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import fs, { FSWatcher } from 'fs';

import gulp from 'gulp';
import del from 'del';
import sourcemaps from 'gulp-sourcemaps';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import named from 'vinyl-named';
import gulp_sass from 'gulp-sass';
import node_sass from 'node-sass';
import gulp_zip from 'gulp-zip';
import * as jsonc from 'jsonc-parser';

import webpackConfig from './webpack.config';

(gulp_sass as any).compiler = node_sass;


// ============================== //
//             Utils              //
// ============================== //

/**
 * Partial typedef for a package.json file
 */
interface Package {
    name: string;
    version: string;
}

/**
 * Reads a json file from disk
 * @param path The path to the JSON file
 */
async function readJson<T>(path: string): Promise<T> {
    return JSON.parse(await fs.promises.readFile(path, "utf-8")) as T;
}

/** Array of functions to run on quit. */
const exitHandlers = new Set<() => Promise<void> | void>();

/**
 * Registers a function to be run when the proccess is quit.
 * Usefull for stopping and cleaning up watch tasks/servers.
 * @param handler
 */
function onExit(handler: () => Promise<void> | void) {
    exitHandlers.add(handler);
}

// On Ctrl-C cleanup and exit
process.on('SIGINT', async () => {

    // Give them 2 seconds before forcibly quiting
    setTimeout(() => process.exit(130), 2000);

    // Notify all handlers
    for (const h of exitHandlers) await h();

});

/**
 * Closes the given watcher when the proccess is quit
 * @param watcher The watcher to close
 */
async function closeOnExit(watcher: FSWatcher) {
    return new Promise((resolve) => onExit(() => resolve(watcher.close())));
}

async function waitOnStream(stream: NodeJS.ReadWriteStream) {
    return new Promise((resolve, reject) => stream.on("end", resolve).on("error", reject));
}


// ============================== //
//             Tasks              //
// ============================== //

/**
 * Cleans the build folders
 */
export function clean() {
    return del("./dist");
}
clean.description = "Cleans the build folders";

/**
 * Syncs the app's manifest.json version to match package.json
 */
export async function sync_manifest_version() {
    const packageJson = await readJson<Package>("./package.json");
    const manifestString = await fs.promises.readFile('./public/manifest.json', "utf-8");
    const edits = jsonc.modify(manifestString, ["version"], packageJson.version, { formattingOptions: {} });
    const newManifestString = jsonc.applyEdits(manifestString, edits);
    await fs.promises.writeFile('./public/manifest.json', newManifestString, "utf-8");
}
sync_manifest_version.description = "Cleans the build folders";

/**
 * Compiles TypeScript files using webpack
 * @param watch If webpack should watch the files
 */
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

/**
 * Compiles TypeScript files
 */
export function typescript() {
    return compile_typescript(false);
}
typescript.description = "Compiles TypeScript files";

/**
 * Compiles sass files
 */
export function sass() {
    return gulp.src("./src/styles/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(gulp_sass().on("error", gulp_sass.logError))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/styles"));
}
sass.description = "Compiles sass files";

/**
 * Copies static files
 */
export function copy() {
    return gulp.src(["./public/**/*"])
        .pipe(gulp.dest("./dist"));
}
copy.description = "Copies static files";

/**
 * Packages built files into a .zip
 */
export async function packageapp() {
    const packageJson = await readJson<Package>("./package.json");
    const outName = `${packageJson.name}-v${packageJson.version}.zip`;
    return waitOnStream(
        gulp.src("./dist/**/*")
            .pipe(gulp_zip(outName))
            .pipe(gulp.dest('./build'))
    );
}
packageapp.description = "Packages built files into a .zip";

/**
 * Watches TypeScript files
 */
export function watch_typescript() {
    return compile_typescript(true);
}
watch_typescript.description = "Watches TypeScript files";

/**
 * Watches sass files
 */
export async function watch_sass() {
    return closeOnExit(gulp.watch("./src/styles/**/*.scss", sass));
}
watch_sass.description = "Watches sass files";

/**
 * Watches static files
 */
export function watch_copy() {
    return closeOnExit(gulp.watch("./public/**/*", copy));
}
watch_copy.description = "Watches static files";

/**
 * Watches all files
 */
export const watch = gulp.parallel(watch_sass, watch_typescript, watch_copy);
watch.description = "Watches all files";

/**
 * Builds all files
 */
export const build = gulp.parallel(sass, typescript);
build.description = "Builds all files";

const defaultTask = gulp.series(clean, sync_manifest_version, copy, build, packageapp);
defaultTask.description = "Builds and packages the app";
export default defaultTask;
