const gulp = require('gulp');
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const ts = require('gulp-typescript');
const concat = require('gulp-concat');
const fs = require('fs');
const tsUniversal = require("ts-universal");
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");

let typingsProject = ts.createProject('src/tsconfig.json', {
    module: "system",
    outFile: undefined,
    outDir: "dist/"
});

let project = ts.createProject('src/tsconfig.json');

let projectEs2015 = ts.createProject('src/tsconfig.json', {
    module: "es6",
    outDir: "dist/es6",
    outFile: undefined
});

let projectSystemJs = ts.createProject('src/tsconfig.json', {
    module: "system",
    outDir: "dist/system",
    outFile: undefined
});

const LIBRARY_NAME = 'wires-watch';

gulp.task('build', function() {
    let result = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(project());
    return result.js.pipe(tsUniversal('build/', {
            expose: 'index',
            //expose2window: true,
            name: LIBRARY_NAME
        }))
        .pipe(rename(LIBRARY_NAME + '.js'))
        .pipe(gulp.dest('build/'));
});

gulp.task('watch', ['build'], function() {
    runSequence("es5-build");
    gulp.watch(['src/**/*.ts'], () => {
        runSequence('build', "es5-build");
    });
});

gulp.task("es5-build", function() {
    return gulp.src("build/" + LIBRARY_NAME + ".js")
        .pipe(babel({ presets: ["es2015"], plugins: [] }))
        .pipe(rename(LIBRARY_NAME + "-es5.js"))
        .pipe(gulp.dest("build/"))
})

gulp.task("es5-uglify", function() {
    return gulp.src("build/" + LIBRARY_NAME + "-es5.js")
        .pipe(rename(LIBRARY_NAME + ".min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/"))
});

gulp.task("build-universal", ["build"], (done) => {
    return runSequence("es5-build", "es5-uglify", done);
});

gulp.task("dist-universal", ["build-universal"], () => {
    return gulp.src(["build/*.**"])
        .pipe(gulp.dest('dist/universal'));
});

gulp.task("dist-typings", () => {
    let result = gulp.src('src/**/*.ts')
        .pipe(typingsProject());
    return result.dts.pipe(gulp.dest('dist/typings'));
});

gulp.task("dist-es2015", () => {
    let result = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(projectEs2015());
    return result.js.pipe(gulp.dest('dist/es2015'));
});

gulp.task("dist-systemjs", () => {
    let result = gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(projectSystemJs());
    return result.js.pipe(gulp.dest('dist/systemjs'));
});


gulp.task('dist', ['dist-universal', 'dist-es2015', 'dist-systemjs', 'dist-typings'], function() {

});