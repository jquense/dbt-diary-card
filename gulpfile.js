var gulp = require('gulp')
  , bootstrap = require('./bootstrap/build'); 


gulp.task('jquery', function(){
    gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/lodash/lodash.js',
        ])
        .pipe(gulp.dest('public/scripts'))    
    
});

gulp.task('bootstrap', bootstrap);

// Default Task
gulp.task('default', ['jquery', 'bootstrap']);