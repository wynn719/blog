var gulp = require('gulp');

var less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber');

gulp.task('styles', function() {
    return gulp.src('src/less/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('src/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(gulp.dest('public/css'))
});

gulp.task('scripts_task1', function() {
    return gulp.src('src/js/common/**/*.js')
        // .pipe(jshint('.jshintrc'))
        // .pipe(jshint.reporter('default'))
        .pipe(plumber())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('public/js/common'))
});

gulp.task('scripts_task2', function() {
    return gulp.src('src/js/lib/**/*.js')
        .pipe(gulp.dest('public/js/lib'))
});

gulp.task('scripts', function() {
    gulp.start('scripts_task1', 'scripts_task2');
});

gulp.task('images', function() {
    return gulp.src('src/imgs/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('public/imgs'));
});

gulp.task('default', function() {
    gulp.start('styles', 'scripts', 'images');
});

gulp.task('watch', function() {
    gulp.watch('src/less/**/*.less', ['styles']);

    gulp.watch('src/js/common/**/*.js', ['scripts_task1']);

    gulp.watch('src/js/lib/**/*.js', ['scripts_task2']);

    gulp.watch('src/imgs/**/*', ['images']);
});