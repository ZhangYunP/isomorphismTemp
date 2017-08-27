const dbconfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'test',
  charset: 'utf8',
  connectionLimit: 30
}

const getFsConf = function (version) {
  const fsconfig = {
    js: {
      dist: 'client/v' + version + '/dist/scripts/',
      src: 'client/v' + version + '/src/scripts/*.js'
    },
    css: {
      dist: 'client/v' + version + '/dist/css/',
      src: 'client/v' + version + '/src/css/*.css'
    },
    img: {
      dist: 'client/v' + version + '/dist/images/',
      src: 'client/v' + version + '/src/images/**'
    },
    font: {
      dist: 'client/v' + version + '/dist/fonts/',
      src: 'client/v' + version + '/src/fonts/**'
    },
    rev: {
      css: 'client/v' + version + '/dist/rev/css/',
      js: 'client/v' + version + '/dist/rev/js/'
    },
    pug: 'views/',
    zip: 'client/v' + version + '/dist/zip/',
    dist: 'client/v' + version + '/dist',
    app: 'app/',
    bundle: 'client/v' + version + '/src/scripts/'
  }
  return fsconfig
}

module.exports = {
  dbconfig,
  getFsConf
}
