var gulp = require('gulp'); 

// Include Our Plugins
var less = require('gulp-less')
  , header = require('gulp-header') 
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , rename = require('gulp-rename');

var bsBanner = '/*!\n' +
               ' * Bootstrap v3.0.2 by @fat and @mdo\n' +
               ' * Copyright <%= year %> Twitter, Inc.\n' +
               ' * Licensed under http://www.apache.org/licenses/LICENSE-2.0 \n' +
               ' *\n' +
               ' * Designed and built with all the love in the world by @mdo and @fat.\n' +
               ' */\n\n'
  , jqueryCheck = 'if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }\n\n'
  , scripts = [
        'bootstrap/js/transition.js',
        'bootstrap/js/alert.js',
        'bootstrap/js/button.js',
        'bootstrap/js/carousel.js',
        'bootstrap/js/collapse.js',
        'bootstrap/js/dropdown.js',
        'bootstrap/js/modal.js',
        'bootstrap/js/tooltip.js',
        'bootstrap/js/popover.js',
        'bootstrap/js/scrollspy.js',
        'bootstrap/js/tab.js',
        'bootstrap/js/affix.js'
    ]

function getStyles() {
    return gulp.src('bootstrap/less/bootstrap.less')
        .pipe(less())
        .pipe(gulp.dest('public/css'));
}

 function getScripts() {
    return gulp.src(scripts)
        .pipe(header(bsBanner + jqueryCheck, { year: (new Date()).getFullYear()}))
        .pipe(concat('bootstrap.js'))
        .pipe(gulp.dest('public/scripts'))
        .pipe(rename('bootstrap.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/scripts'));
}

module.exports = function() {
    getStyles()
    getScripts()
}

