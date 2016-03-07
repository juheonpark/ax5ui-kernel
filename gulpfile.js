'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");
var babel = require('gulp-babel');

var PATHS = {
    ax5core: {
        isPlugin: true,
        root: "src/ax5core",
        src: "src/ax5core/src",
        dest: "src/ax5core/dist",
        js: "ax5core",
        doc_src: "src/ax5docs/_src_ax5core",
        doc_dest: "src/ax5docs/ax5core"
    },
    "ax5ui-dialog": {
        isPlugin: true,
        root: "src/ax5ui-dialog",
        src: "src/ax5ui-dialog/src",
        dest: "src/ax5ui-dialog/dist",
        scss: "ax5dialog.scss",
        js: "ax5dialog",
        doc_src: "src/ax5docs/_src_ax5ui-dialog",
        doc_dest: "src/ax5docs/ax5ui-dialog"
    },
    "ax5ui-mask": {
        isPlugin: true,
        root: "src/ax5ui-mask",
        src: "src/ax5ui-mask/src",
        dest: "src/ax5ui-mask/dist",
        scss: "ax5mask.scss",
        js: "ax5mask",
        doc_src: "src/ax5docs/_src_ax5ui-mask",
        doc_dest: "src/ax5docs/ax5ui-mask"
    },
    "ax5ui-toast": {
        isPlugin: true,
        root: "src/ax5ui-toast",
        src: "src/ax5ui-toast/src",
        dest: "src/ax5ui-toast/dist",
        scss: "ax5toast.scss",
        js: "ax5toast",
        doc_src: "src/ax5docs/_src_ax5ui-toast",
        doc_dest: "src/ax5docs/ax5ui-toast"
    },
    "ax5ui-modal": {
        isPlugin: true,
        root: "src/ax5ui-modal",
        src: "src/ax5ui-modal/src",
        dest: "src/ax5ui-modal/dist",
        scss: "ax5modal.scss",
        js: "ax5modal",
        doc_src: "src/ax5docs/_src_ax5ui-modal",
        doc_dest: "src/ax5docs/ax5ui-modal"
    },
    "ax5ui-calendar": {
        isPlugin: true,
        root: "src/ax5ui-calendar",
        src: "src/ax5ui-calendar/src",
        dest: "src/ax5ui-calendar/dist",
        scss: "ax5calendar.scss",
        js: "ax5calendar",
        doc_src: "src/ax5docs/_src_ax5ui-calendar",
        doc_dest: "src/ax5docs/ax5ui-calendar"
    },
    "ax5ui-picker": {
        isPlugin: true,
        root: "src/ax5ui-picker",
        src: "src/ax5ui-picker/src",
        dest: "src/ax5ui-picker/dist",
        scss: "ax5picker.scss",
        js: "ax5picker",
        doc_src: "src/ax5docs/_src_ax5ui-picker",
        doc_dest: "src/ax5docs/ax5ui-picker"
    },
    "ax5ui-formatter": {
        isPlugin: true,
        root: "src/ax5ui-formatter",
        src: "src/ax5ui-formatter/src",
        dest: "src/ax5ui-formatter/dist",
        scss: "ax5formatter.scss",
        js: "ax5formatter",
        doc_src: "src/ax5docs/_src_ax5ui-formatter",
        doc_dest: "src/ax5docs/ax5ui-formatter"
    }
};

function errorAlert(error) {
    notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Purr"})(error); //Error Notification
    console.log(error.toString());//Prints Error to Console
    this.emit("end"); //End function
};

/**
 * SASS
 */
for (var k in PATHS) {
    var __p = PATHS[k];
    if (__p.isPlugin && __p.scss) {
        gulp.task(k + '-scss', (function (k, __p) {
            return function () {
                gulp.src(PATHS[k].src + '/' + __p.scss)
                    .pipe(plumber({errorHandler: errorAlert}))
                    .pipe(sass({outputStyle: 'compressed'}))
                    .pipe(gulp.dest(PATHS[k].dest));
            }
        })(k, __p));
    }
}

/**
 * for JS
 */
for (var k in PATHS) {
    var __p = PATHS[k];
    if (__p.isPlugin && __p.js) {
        gulp.task(k + '-scripts', (function (k, __p) {
            return function () {
                gulp.src(PATHS[k].src + '/*.js')
                    .pipe(plumber({errorHandler: errorAlert}))
                    .pipe(concat(__p.js + '.js'))
                    .pipe(babel({
                        presets: ['es2015']
                    }))
                    .pipe(gulp.dest(PATHS[k].dest))
                    .pipe(concat(__p.js + '.min.js'))
                    .pipe(uglify())
                    .pipe(gulp.dest(PATHS[k].dest));
            }
        })(k, __p));
    }
}


/**
 * watch
 */
gulp.task('default', function () {

    // scripts
    for (var k in PATHS) {

        var __p = PATHS[k];
        if (__p.isPlugin && __p.js) {
            gulp.watch(PATHS[k].src + '/*.js', [k + '-scripts']);
        }
        if (__p.isPlugin && __p.scss) {
            gulp.watch(PATHS[k].src + '/**/*.scss', [k + '-scss']);
        }
    }

});