
const source = require('vinyl-source-stream')
const gulp = require('gulp');
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ()=> {
  return gutil.log('Gulp is running!');
})

gulp.task('build', () => {
  build_react();
  build_login();
})

function build_react() {
  gulp.src([
    'src_react/util.js',
    'src_react/components/home_button.jsx',
    'src_react/components/dispatcher.js',
    'src_react/components/user_search_widget.jsx',
    'src_react/components/add_store.jsx',
    'src_react/components/add_transaction.jsx',
    'src_react/components/transaction_view_detail.jsx',
    'src_react/components/transactions_view.jsx',
    'src_react/components/store_management.jsx',
    'src_react/components/stores_page.jsx',
    'src_react/components/user_management.jsx',
    'src_react/components/main.jsx'
  ])
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(concat('reactComponents.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('bin'));
  return gutil.log('React build complete.');
}

function build_login() {
  gulp.src([
    'src_react/components/login.jsx'
  ])
  .pipe(babel())
  .pipe(concat('loginComponent.js'))
  .pipe(gulp.dest('bin'));
  return gutil.log('Login built.');
}

