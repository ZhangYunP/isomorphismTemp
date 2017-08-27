const gulp = require('gulp')
const uglify = require('gulp-uglify')
const del = require('gulp-clean')
const cssMinify = require('gulp-minify-css')
const rev = require('gulp-rev')
const revColl = require('gulp-rev-collector')
const gutil = require('gulp-util')
const pug = require('gulp-pug')
const zip = require('gulp-zip')
const htmlToPug = require('gulp-htmltopug')
const rename = require('gulp-rename')
const fs = require('fs-extra')
const args = require('yargs').argv
const cssSprite = require('gulp-css-spriter')
const assertConf = require('./config/config.js')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')
const dllConfig = require('./dll.config.js')

const version = args.vs

const fsConfig = assertConf.getFsConf(version)

function clean() {
  try {
    fs.ensureDirSync(fsConfig.dist)
    return gulp.src(fsConfig.dist)
    .pipe(del())
  } catch (e) {
    gutil.log('[clean: dist]', e.toString({
      color: true
    }))
  }
}

function cleanView() {
  try {
    fs.ensureFileSync(fsConfig.pug + 'a.html')
    return gulp.src([fsConfig.pug + 'a.html', fsConfig.pug + 'index.pug'])
    .pipe(del())
  } catch (e) {
    gutil.log('[clean: view]', e.toString({
      color: true
    }))
  }
}

function cleanBundleFile() {
  try {
    fs.ensureFileSync(fsConfig.bundle + 'index.bundle.js')
    fs.ensureFileSync(fsConfig.bundle + 'index.bundle.js.map')
    fs.ensureFileSync(fsConfig.bundle + 'vendor.js')
    return gulp.src([fsConfig.bundle + 'index.bundle.js', fsConfig.bundle + 'vendor.js', fsConfig.bundle + 'index.bundle.js.map'])
    .pipe(del())
  } catch (e) {
    gutil.log('[clean: BundleFile]', e.toString({
      color: true
    }))
  }
}

function cleanManifest() {
  try {
    fs.ensureFileSync('manifest.json')
    return gulp.src('manifest.json')
    .pipe(del())
  } catch (e) {
    gutil.log('[clean: Manifest]', e.toString({
      color: true
    }))
  }
}

function uglifyJs() {
  return gulp.src(fsConfig.js.src)
  .pipe(uglify())
  .on('error', gutil.log)
  .pipe(rev())
  .pipe(gulp.dest(fsConfig.js.dist))
  .pipe(rev.manifest())
  .pipe(gulp.dest(fsConfig.rev.js))
}

function minifyCss() {
  return gulp.src(fsConfig.css.src)
  .pipe(cssSprite({
    spriteSheet: './client/v' + version + '/src/images/sprite/sprite.png',
    pathToSpriteSheetFromCSS: '../images/sprite/sprite.png'
  }))
  .pipe(cssMinify())
  .on('error', gutil.log)
  .pipe(rev())
  .pipe(gulp.dest(fsConfig.css.dist))
  .pipe(rev.manifest())
  .pipe(gulp.dest(fsConfig.rev.css))
}

function copyJs() {
  return gulp.src(fsConfig.js.src)
  .pipe(gulp.dest(fsConfig.js.dist))
}

function copyCss() {
  return gulp.src(fsConfig.css.src)
  .pipe(cssSprite({
    spriteSheet: './client/v' + version + '/src/images/sprite/sprite.png',
    pathToSpriteSheetFromCSS: '../images/sprite/sprite.png'
  }))
  .pipe(gulp.dest(fsConfig.css.dist))
}

function copyImg() {
  return gulp.src(fsConfig.img.src)
  .pipe(gulp.dest(fsConfig.img.dist))
}

function copyFont() {
  return gulp.src(fsConfig.font.src)
  .pipe(gulp.dest(fsConfig.font.dist))
}

function convertToHtml() {
  return gulp.src(fsConfig.pug + 'a.pug')
  .pipe(pug())
  .pipe(gulp.dest(fsConfig.pug))
}

function convertToPug() {
  return gulp.src(fsConfig.pug + 'a.html')
  .pipe(htmlToPug())
  .pipe(rename('index.pug'))
  .pipe(gulp.dest(fsConfig.pug))
}

function revCollector() {
  return gulp.src([fsConfig.rev.js + 'rev-manifest.json', fsConfig.rev.css + 'rev-manifest.json', fsConfig.pug + 'a.html'])
  .pipe(revColl({
    replaceReved: true
  }))
  .pipe(gulp.dest(fsConfig.pug))
}

function copyTemplate() {
  return gulp.src(fsConfig.pug + 'a.pug')
  .pipe(rename('index.pug'))
  .pipe(gulp.dest(fsConfig.pug))
}

function webpackProd(cb) {
  const prodConf = Object.create(webpackConfig)
  prodConf.devtool = 'cheap-module-eval-source-map'
  prodConf.plugins.push(new webpack.NoErrorsPlugin())
  prodConf.plugins.push(new webpack.DllReferencePlugin({
    context: __dirname,
    /* eslint-disable global-require */
    manifest: require('./manifest.json')
    /* eslint-enable global-require */
  }))
  prodConf.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }))
  webpack(prodConf, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:build-prod', err)
    }
    gutil.log('[webpack:build-prod]', stats.toString({
      color: true
    }))
    cb()
  })
}

function dllBuild(cb) {
  const dll = Object.create(dllConfig)
  webpack(dll, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:build-dll', err)
    }
    gutil.log('[webpack:build-dll]', stats.toString({
      color: true
    }))
    cb()
  })
}

function zipFs() {
  return gulp.src(fsConfig.dist + '/**/*')
  .pipe(zip('resource.zip'))
  .pipe(gulp.dest(fsConfig.zip))
}

function watch(cb) {
  gulp.watch(fsConfig.js.src, copyJs)
  gulp.watch(fsConfig.css.src, copyCss)
  gulp.watch(fsConfig.font.src, copyFont)
  gulp.watch(fsConfig.img.src, copyImg)
  gulp.watch(fsConfig.dist).on('change', (file) => {
    console.log('dist are changing' + file)
  })
  cb()
}

gulp.task('build', gulp.series(clean, cleanView, cleanManifest, dllBuild, webpackProd,
  gulp.parallel(uglifyJs, minifyCss),
  gulp.parallel(copyImg, copyFont),
  convertToHtml,
  revCollector,
  convertToPug,
  zipFs,
  (cb) => {
    console.log('build success!')
    cb()
  }
 ))

gulp.task('default', gulp.series(clean, cleanBundleFile,
   gulp.parallel(copyJs, copyCss),
   gulp.parallel(copyImg, copyFont, copyTemplate),
   watch,
   (cb) => {
     console.log('now watching')
     cb()
   }
  ))

// function compilePug() {
//   return gulp.src('views/a.pug')
//   .pipe(pug())
//   .pipe(htmlToPug())
//   .pipe(gulp.dest('views/a'))
// }
// gulp.task('com', compilePug)
