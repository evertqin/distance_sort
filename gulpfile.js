var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var gutil = require('gulp-util');
var sass = require('gulp-sass');

function compile(watch) {
	var bundler = watchify(browserify('./public/js/main.js', {
		debug: true,
		extensions: ['.js'],
	}).transform(babel, {
		presets: ["es2015", "react", 'stage-0']
	}));


	bundler.on('log', (msg) => {
		gutil.log(gutil.colors.cyan('scripts') + ': ' + msg);
	});

	function rebundle() {
		bundler.bundle()
			.on('error', function(err) {
				console.error(err.message);
				this.emit('end');
			})
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./public/dist/js'));
	}



	if (watch) {
		bundler.on('update', function() {
			console.log('-> bundling...');
			rebundle();
		});

	}

	rebundle();
}



function watch() {
	return compile(true);
};

gulp.task('build', function() {
	return compile();
});
gulp.task('watch', function() {
	return watch();
});

gulp.task('sass', function() {
	gulp.src('./public/stylesheets/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./public/dist/stylesheets'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./public/stylesheets/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);