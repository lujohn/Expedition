var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var usemin = require('gulp-usemin');
var minifycss = require('gulp-minify-css');
var rev = require('gulp-rev');
var uglify = require('gulp-uglify');
var del = require('del');
var zip = require('gulp-zip');

gulp.task('default', ['clean'], function () {
	console.log("Doing Something...");
	gulp.start('jshint', 'usemin', 'copyimage');
});

gulp.task('jshint', function () {
	var stream = gulp.src('app/scripts/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter(stylish));

	return stream;
});

gulp.task('usemin', function () {
	var stream = gulp.src('./app/index.html')
	.pipe(usemin({
		css: [minifycss(), rev()],
		js: [uglify(), rev()]
	}))
	.pipe(gulp.dest('dist/'));

	return stream;
});

gulp.task('copyimage', function() {
	var stream = gulp.src('./app/images/**/*')
	.pipe(gulp.dest('dist/images'));

	return stream;
});

gulp.task('zip', ['default'], function() {
	return gulp.src('dist/**')
	.pipe(zip('dist.zip'))
	.pipe(gulp.dest('/'));
});

gulp.task('clean', function () {
	return del(['dist']);
});
