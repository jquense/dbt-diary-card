var gulp = require('gulp')
  , less = require('gulp-less')
  , source = require('vinyl-source-stream')
  , browserify = require('browserify')
  , bootstrap = require('./bootstrap/build')
  , fs = require('fs');

gulp.task('copy', function(){
    gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/lodash/lodash.js',
        ])
        .pipe(gulp.dest('public/scripts'))    
    
});

gulp.task('bootstrap', bootstrap);

gulp.task('less', function(){
    gulp.src('./styles/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('templates', function(){
    var bundle = browserify({ debug: true })
      , files = fs
        .readdirSync('./views')
        .filter(function(name){ return name.indexOf('.hbs') !== -1 })
        .map(function(name){ return './views/' + name });
    
    bundle.add('hbsfy/runtime') 
    bundle.add('./src/helpers.js') 
    bundle.add('./src/partials.js') 
    bundle.require('hbsfy/runtime')
    bundle.require(files) 
    bundle.transform('browserify-swap')

    bundle.bundle()
        .pipe(source('templates.js'))
        .pipe(gulp.dest('./public/scripts'))
        
});

gulp.task('build', function(){
    var bundle = browserify()
      , files = fs
        .readdirSync('./views')
        .filter(function(name){ return name.indexOf('.hbs') !== -1 })
        .map(function(name){ return './views/' + name })

    bundle.add('./src/site.js') 
    bundle.transform('browserify-swap')
    bundle.external(files) 
    bundle.external('hbsfy/runtime')

    bundle.bundle({ debug: true })
        .pipe(source('site.js'))
        .pipe(gulp.dest('./public/scripts'))
        
});

gulp.task('watch', function() {
    gulp.watch('./styles/**/*.less', ['less']);
    gulp.watch('./src/**/*', ['build']);
    gulp.watch([
        './views/**/*.hbs'
      , './src/partials.js'
      , './src/helpers.js'], ['templates']);
});

// Default Task
gulp.task('browserify', ['templates', 'build']);
gulp.task('default', ['copy', 'bootstrap', 'browserify']);