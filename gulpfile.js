const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

const distDirectory = 'dist';
const htmlBlob = 'src/*.html';
const imagesBlob = 'src/img/**';
const stylesBlob = 'src/scss/**';
const sassBlob = 'src/scss/**';
const jsBlob = 'src/js/**';
const normalizeBlob = 'src/normalize/**';

gulp.task('default', function () {
  return runSequence('build', 'serve');
});

gulp.task('build', function () {
  return runSequence(
    'cleanDist',
    ['processStyles', 'processHtml', 'processImages','sass','js','normalize']
  );
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: distDirectory
    }
  });

  gulp.watch(htmlBlob, function () {
    return runSequence('processHtml', 'reloadBrowser');
  });
  gulp.watch(imagesBlob, function () {
    return runSequence('processImages', 'reloadBrowser');
  });
  gulp.watch(stylesBlob, function () {
    return runSequence('processStyles', 'reloadBrowser');
  });
   gulp.watch(sassBlob, function () {
    return runSequence('sass', 'reloadBrowser');
  });
   gulp.watch(jsBlob, function () {
    return runSequence('js', 'reloadBrowser');
  });
  gulp.watch(normalizeBlob, function () {
    return runSequence('js', 'reloadBrowser');
  });
});

gulp.task('cleanDist', function () {
  return gulp.src(distDirectory, {read: false, allowEmpty: true}).pipe(clean());
});

gulp.task('processHtml', function () {
  return gulp.src(htmlBlob)
    .pipe(gulp.dest(distDirectory));
});

gulp.task('processImages', function () {
  return gulp.src(imagesBlob)
    .pipe(gulp.dest(`${distDirectory}/img/`));
});

gulp.task('processFonts', function () {
  return gulp.src(fontsBlob)
    .pipe(gulp.dest(`${distDirectory}/fonts/`));
});

gulp.task('processStyles', function () {
  return gulp.src(stylesBlob)
    .pipe(concat('styles.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(`${distDirectory}/css/`));
});

gulp.task('reloadBrowser', function (done) {
  browserSync.reload();
  done();
});
gulp.task('sass', function() {
  return  gulp.src('src/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css/'))
});
gulp.task('js', function() {
  return gulp.src(jsBlob)
  .pipe(gulp.dest(`${distDirectory}/js/`));
});
gulp.task('normalize', function() {
  return gulp.src(normalizeBlob)
  .pipe(gulp.dest(`${distDirectory}/normalize/`));
});