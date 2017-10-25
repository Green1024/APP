var gulp = require('gulp');
var bs = require('browser-sync').create();

gulp.task('serve', function () {
    bs.init({
        server: {
            baseDir: './www/'
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(["./www/*.html", "./www/css/*.css", "./www/js/*.js"], function () {
        bs.reload();
    });
});

gulp.task('default', ['serve', 'watch']);