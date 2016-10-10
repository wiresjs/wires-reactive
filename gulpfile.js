const gulp = require('gulp');
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const uglify = require("gulp-uglify");
const webpack = require('webpack-stream');
const babel = require("gulp-babel");
let projectTypings = ts.createProject('src/tsconfig.json');
let projectCommonjs = ts.createProject('src/tsconfig.json');
const LIBRARY_NAME = 'universal-dom';
gulp.task("dist-typings", () => {
    let result = gulp.src('src/**/*.ts')
        .pipe(projectTypings());
    return result.dts.pipe(gulp.dest('dist/typings'));
});

gulp.task("dist-commonjs", () => {
    let result = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(projectCommonjs());
    return result.js.pipe(gulp.dest('dist/commonjs'));
});

gulp.task("webpack", () => {
    return gulp.src('build/commonjs/index.js')
        .pipe(webpack({
            output: {
                filename: 'index.js',
                libraryTarget: "var",
                library: "WiresReactive"
            }
        }))
        .pipe(rename("wires-reactive.js"))
        .pipe(babel({ presets: ["es2015"] }))
        .pipe(gulp.dest('build/browser'));
});

gulp.task("test-build", ["build"], () => {
    return runSequence("webpack")
});



gulp.task('build', function() {
    let result = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(projectCommonjs());
    return result.js.pipe(gulp.dest('build/commonjs'));
});

gulp.task('watch', ['build'], function() {
    runSequence("webpack");
    gulp.watch(['src/**/*.ts'], () => {
        runSequence('build', "webpack");
    });
});

gulp.task('dist', ['dist-typings', 'dist-commonjs'], function() {

});