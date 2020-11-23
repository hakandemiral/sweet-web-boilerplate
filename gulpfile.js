const gulp = require('gulp');
const sass = require('gulp-sass');
sass.complier = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');

///////////////////////////////////////////////////////
////////////////////  File Paths  /////////////////////
///////////////////////////////////////////////////////

//CSS
const styleSheetsSource = 'src/stylesheets/**/*.scss';
const styleSheetsTarget = 'dist/stylesheets';

//JS
const scriptsSource = 'src/javascripts/**/*.js';
const scriptsTarget = 'dist/javascripts';

//IMG
const imagesSource = 'src/assets/images/**/*';
const imagesTarget = 'dist/assets/images'

//HTML
const htmlsSource = 'src/**/*.html';
const htmlsTarget = 'dist';

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////


//HTML
gulp.task('html', () => {
    return gulp.src(htmlsSource)
        .pipe(gulp.dest(htmlsTarget))
        .pipe(browserSync.stream())
});

//STYLESHEET
gulp.task('stylesheet', () => {
    return gulp.src(styleSheetsSource)
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: 'compressed',
            sourceComments: false,
            includePaths: ['.']
        }).on('error', sass.logError))
        .pipe(gulp.dest(styleSheetsTarget))
        .pipe(browserSync.stream())
});

//SCRIPTS
gulp.task('script', () => {
    return gulp.src(scriptsSource)
        .pipe(concat('app.min.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(scriptsTarget))
        .pipe(browserSync.stream())
});

//IMAGES
gulp.task('image', () => {
    return gulp.src(imagesSource)
        .pipe(imagemin())
        .pipe(gulp.dest(imagesTarget))
        .pipe(browserSync.stream())
});

//BROWSER-SYNC
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
});

//DELETE
gulp.task('delete', () => (
    del([
        styleSheetsTarget, 
        scriptsTarget, 
        imagesTarget, 
        htmlsTarget + '/**/*.html'
    ])
));

//WATCH
gulp.task('watch', () => {
    gulp.watch(styleSheetsSource, gulp.task('stylesheet'));
    gulp.watch(scriptsSource, gulp.task('script'));
    gulp.watch(imagesSource, gulp.task('image'));
    gulp.watch(htmlsSource, gulp.task('html'));
})

//GULPPP
gulp.task('default', gulp.series('delete', gulp.parallel('html', 'stylesheet', 'script', 'image', 'browser-sync', 'watch')))