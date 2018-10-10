var gulp = require('gulp');
var del = require('del');
var $ = require('gulp-load-plugins')();
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var minifyHtml = require("gulp-minify-html");
var runSequence = require('run-sequence');
var assetRev = require('gulp-asset-rev');
const autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
var connect = require('gulp-connect');
var spritesmith = require('gulp.spritesmith');

gulp.task('sprite', function () {
    var spriteData = gulp.src('src/images/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css'
    }));
    return spriteData.pipe(gulp.dest('dist/output/'));
});

gulp.task('myServer', function() {
    connect.server({
        root: 'dist',
        port: 8000,
        livereload: true
    });
});

gulp.task('fileinclude', function() {
    gulp.src(['src/*.html'])//主文件
        .pipe(fileinclude({
            prefix: '@@',//变量前缀 @@include
            basepath: 'src/include',//引用文件路径
            indent:true//保留文件的缩进
        }))
        .pipe(gulp.dest('dist'));//输出文件路径
});

gulp.task('devsass', function(){
    gulp.src('src/sass/**/*.scss')
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
});

gulp.task('sa-ss', function(){
   gulp.src('src/sass/**/*.scss')
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
});


gulp.task('minify-css', function () {
    gulp.src(['src/css/*.css','src/sass/*.scss']) // 要压缩的css文件
        .pipe(sass())
        .pipe(assetRev())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCss()) //压缩css
        .pipe(gulp.dest('dist/css'));
});
gulp.task('minify-js', function () {
    gulp.src(['src/js/*.js','!src/js/jquery*.js']) // 要压缩的js文件
        .pipe(assetRev())
        .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
        .pipe(gulp.dest('dist/js')); //压缩后的路径
});
gulp.task('copy-js',function(){
    gulp.src('src/js/jquery*.js')
        .pipe(gulp.dest('dist/js'));
});
// gulp.task('minify-html', function () {
//     gulp.src('src/*.html') // 要压缩的html文件
//         .pipe(fileinclude({
//             prefix: '@@',//变量前缀 @@include
//             basepath: 'src/include',//引用文件路径
//             indent:true//保留文件的缩进
//         }))
//         .pipe(minifyHtml()) //压缩
//         .pipe(gulp.dest('dist'));
// });
gulp.task('img',function () {
    gulp.src('src/images/*.*')
        .pipe(gulp.dest('dist/images'))
});

gulp.task('app_rev', ['minify-css', 'minify-js','copy-js'], function() {
    gulp.src(['src/*.html',  'src/**/*.html']) //源文件下面是所有html
        .pipe(fileinclude({
            prefix: '@@',//变量前缀 @@include
            basepath: './src/include',//引用文件路径
            indent:true//保留文件的缩进
        }))
        .pipe(assetRev()) //配置引用的js和css文件，需要的话也可以用minifyHtml压缩html文件
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist')); //打包到目标文件夹路径下面
});

gulp.task('app_rev_watch', ['minify-css', 'minify-js'], function() {
    gulp.src(['src/*.html',  'src/**/*.html']) //源文件下面是所有html
        .pipe(fileinclude({
            prefix: '@@',//变量前缀 @@include
            basepath: 'src/include',//引用文件路径
            indent:true//保留文件的缩进
        }))
        .pipe(assetRev()) //配置引用的js和css文件，需要的话也可以用minifyHtml压缩html文件
        .pipe(minifyHtml())
        .pipe(gulp.dest('dist')); //打包到目标文件夹路径下面
});

//监听
gulp.task('watch', function () {
    //gulp.watch(['src/sass/*.scss'],['devsass']);

    gulp.watch(['src/css/*.css','src/sass/*.scss'], ['minify-css']);
    gulp.watch(['src/js/*.js','!src/js/jquery*.js'], ['minify-js']);
    gulp.watch(['src/*.html','src/**/*.html'], ['app_rev_watch']);
});
gulp.task('clean', del.bind(null, ['dist'], {
    force: true
}));

// gulp.task("dev", function() {
//     runSequence('clean', ['img','app_rev']);
// });

gulp.task("default", function() {
    runSequence('clean', ['myServer','img','app_rev','watch']);
});

// gulp.task('default', ['minify-css', 'minify-js','img','minify-html'], function() {
//     console.log('ok')
// });