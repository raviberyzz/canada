const gulpSort = require('gulp-sort');

const gulp = require('gulp'),
 cssnano = require('gulp-cssnano'),
 sass = require('gulp-sass'),
 concat = require('gulp-concat'),
 uglify = require('gulp-uglify'),
 browserSync = require('browser-sync').create(),
 babel = require('gulp-babel'),
 clean = require('gulp-clean'),
 fs   = require('fs'),
 fse = require('fs-extra')
 path = require('path'),
 sort = require('gulp-sort'),
 flatten = require('gulp-flatten'),
 gulpif = require('gulp-if'),
 gulpIgnore = require('gulp-ignore'),
 buffer = require('vinyl-buffer'),
 merge = require('merge-stream');

//Constants declarations for Browserify
const babelify = require('babelify');
const browserify = require('browserify'); 
const source = require('vinyl-source-stream');
const glob =require('glob');

//Constants declarations
 const srcViews = 'src/views';
 const sitePaths = {'hk':'apac/hk','id':'apac/id','ph':'apac/ph','vn':'apac/vn'};

gulp.task('browser-sync', (done) => {
  browserSync.init({
    proxy: 'http://localhost:3000'
  });
  done();
});

const compareFiles = (f1, f2) => {
  const f1Name = path.basename(f1.path);
  const f2Name = path.basename(f2.path);
  if(isNaN(f1Name.split('-')[0]) || isNaN(f2Name.split('-')[0])) {
    return f1Name > f2Name ? 1 : -1;
  }
  return Number(f1Name.split('-')[0]) > Number(f2Name.split('-')[0]) ? 1 : -1;
}


const compareNames = (f1, f2) => {
  if(isNaN(f1.split('-')[0]) || isNaN(f2.split('-')[0])) {
    return f1 > f2 ? 1 : -1;
  }
  return Number(f1.split('-')[0]) > Number(f2.split('-')[0]) ? 1 : -1;
}

const getFolders = (dir) => {
  return fs.readdirSync(dir).filter((file)=>{return fs.statSync(path.join(dir, file)).isDirectory();});
}

gulp.task('compile-files', (done) => {
  const folders = getFolders(srcViews);
  if (folders.length === 0) return done(); // nothing to do!
  const sassTasks = folders.map((folder)=> {
    return gulp.src(path.join(srcViews, folder, '/**/*.scss'))
      .pipe(sass())
      .pipe(sort(compareFiles))
      .pipe(concat('style.css'))
      //.pipe(cssnano())
      .pipe(gulp.dest('public/'+folder+'/css'))
  });
  const vendorCssTasks = folders.map((folder)=> {
    return gulp.src(path.join(srcViews, folder, 'vendor/**/*.css'))
      .pipe(sort(compareFiles))
      .pipe(concat('vendor.css'))
      //.pipe(cssnano())
      .pipe(gulp.dest('public/'+folder+'/vendor/css'))
      //.pipe(cssnano())
  });
  const jsTasks = folders.map((folder)=> {
    return gulp.src([path.join(srcViews, folder, 'base/**/*.js'),path.join(srcViews, folder, 'components/**/*.js')])
      .pipe(sort(compareFiles))
      .pipe(concat('script.js'))
      //.pipe(uglify())
      .pipe(gulp.dest('public/'+folder+'/js'))
  });
  const vendorJsTasks = folders.map((folder)=> {
    return gulp.src(path.join(srcViews, folder, 'vendor/**/*.js'))
      .pipe(gulpIgnore.exclude(/.*mfa-*/))
      .pipe(sort(compareFiles))
      .pipe(concat('vendor.js'))
      //.pipe(uglify())
      .pipe(gulp.dest('public/'+folder+'/vendor/js'))
  });
  const fontsVendorTask = folders.map((folder)=> {
    return gulp.src(path.join(srcViews, folder, 'vendor/resources/*.*'))
      .pipe(flatten({ includeParents: -1} ))
      .pipe(gulp.dest('public/'+folder+'/vendor'))
  });
  const fontsBaseTask = folders.map((folder)=> {
    return gulp.src(path.join(srcViews, folder, 'base/resources/*.*'))
      .pipe(flatten({ includeParents: -1} ))
      .pipe(gulp.dest('public/'+folder))
  });
  const reactJsTasks = folders.map((folder)=> {
    if (folder !== 'core') {
     return  gulp.src(path.join(srcViews, folder, '/**/*.jsx'))
       .pipe(concat('react.js'))
       // .pipe(uglify())
       .pipe(babel({
         presets: ["@babel/preset-env", "@babel/preset-react"]
       }))
       .pipe(buffer())
       .pipe(uglify())  
       .pipe(gulp.dest('public/' + folder + '/js'));

   }else{
        var files = glob.sync(srcViews+'/'+folder+'/**/*.jsx');
        return browserify({ entries: files})
        .transform("babelify", { presets: ["@babel/preset-env", "@babel/preset-react"], plugins: ["@babel/plugin-proposal-class-properties"] })
        .bundle()
        .pipe(source('react.js'))  
        .pipe(buffer())
        .pipe(uglify())  
        .pipe(gulp.dest('public/'+folder+'/js')) 
   }
  });
  return merge(sassTasks, vendorCssTasks,jsTasks,vendorJsTasks,reactJsTasks,fontsVendorTask,fontsBaseTask);
});

gulp.task('browser-reload',(done) => {browserSync.reload();done();});

gulp.task('watch', (done) => {
  console.log('Change detected ...  watching files');
  gulp.watch(['src/views/**/*.scss','src/views/**/*.css','src/views/**/*.js','src/views/**/*.jsx','src/views/**/resources/*.*'], gulp.series(['compile-files','browser-reload'])); 
  done();
});

gulp.task('clean', (done) => {
  if(fs.existsSync('dist')) {
    return gulp.src('dist')
      .pipe(clean({read: false, force: true}))
  }
  done();
});

gulp.task('compile-sass',() =>{
  return gulp.src('src/views/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist'))
});

gulp.task('compile-react',(done) =>{
  const folders = getFolders(srcViews);  
  const reactJsTasks =  folders.map((folder)=> {
    if(folder !== 'core'){
     return gulp.src(path.join(srcViews, folder, '/**/*.jsx'))
        .pipe(concat('components.js'))
        .pipe(babel({
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }))
        .pipe(buffer())
        .pipe(uglify())  
        .pipe(gulp.dest('dist/'+folder+'/react-components'))  
      }else{
    var files = glob.sync(srcViews+'/'+folder+'/**/*.jsx');
    return browserify({ entries: files})
    .transform("babelify", { presets: ["@babel/preset-env", "@babel/preset-react"], plugins: ["@babel/plugin-proposal-class-properties"] })
    .bundle()
    .pipe(source('components.js'))  
    .pipe(buffer())
    .pipe(uglify())  
    .pipe(gulp.dest('dist/'+folder+'/react-components')) 
      }
  });  
  return merge(reactJsTasks);
});

gulp.task('copy-files',() => {
  return gulp.src(['src/views/**/*.js','src/views/**/*.css','src/views/**/resources/*.*'])
  .pipe(gulp.dest('dist'))
});

const generateClientLibs = (cb) => {
  fs.readdirSync('dist').forEach( (name) => {
    const parentFolder = path.join('dist', name)
    const stat = fs.statSync(parentFolder)
    if (stat.isDirectory()) {
      const pClientLib = path.join(parentFolder,'clientlibs');
      checkAndCreateDir(pClientLib);
      fs.readdirSync(parentFolder).forEach((cname) => {
        if(cname != 'clientlibs' && cname != 'components') {
          fse.moveSync(path.join(parentFolder,cname),path.join(pClientLib,cname));
          createClientLibs(path.join(pClientLib,cname),'sunlife.'+name+'.'+cname);
          fs.readdirSync(path.join(pClientLib,cname)).forEach( (vname) => {
            const vstat = fs.statSync(path.join(pClientLib,cname,vname));
            if (vstat.isDirectory()) {
              if(vname != 'js' && vname !='css' && vname != 'resource') {
                createClientLibs(path.join(pClientLib,cname,vname),'sunlife.'+name+'.'+cname+'.'+vname);
              }
            }
          });
        } else if (cname === 'components') {
          parseComponentFolders(path.join(parentFolder,cname),'sunlife.'+name+'.component');
        }
      });
    } 
  })
  fs.readdirSync('dist').forEach( (name) => {
    if(sitePaths[name]) {
      fse.moveSync(path.join('dist', name),path.join('dist', sitePaths[name]));
    }
  });
  cb();
}

const parseComponentFolders = (fpath,name) => { 
  const css = fs.readdirSync(fpath).filter((n) => { return n.endsWith('.css')});
  const js = fs.readdirSync(fpath).filter((n) => { return n.endsWith('.js')});
  if(css.length > 0 || js.length > 0 ) {
    const pClientLib = path.join(fpath,'clientlibs');
    checkAndCreateDir(pClientLib);
    css.forEach((fname) => {
      fse.moveSync(path.join(fpath,fname),path.join(pClientLib,fname));
    });
    js.forEach((fname) => {
      fse.moveSync(path.join(fpath,fname),path.join(pClientLib,fname));
    });
    createClientLibs(pClientLib,name);
  } else {
    fs.readdirSync(fpath).forEach((cname) => {
      const cPath = path.join(fpath,cname);
      if(fs.statSync(cPath).isDirectory()) {
        parseComponentFolders(cPath,name);
      }
    });
  }
}

const checkAndCreateDir = (p) => {
  if(!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

const createClientLibs = (p,name) => {
  checkAndCreateDir(path.join(p,'js'));
  checkAndCreateDir(path.join(p,'css'));
  const css = fs.readdirSync(p).filter((n) => { return n.endsWith('.css')});
  const js = fs.readdirSync(p).filter((n) => { return n.endsWith('.js')});
  let cssContent = '#base=css\n';
  let jsContent = '#base=js\n';
  css.sort(compareNames).forEach((fname) => {
    cssContent+=fname+'\n';
    fse.moveSync(path.join(p,fname),path.join(p,'css',fname));
  });
  js.sort(compareNames).forEach((fname) => {
    jsContent+=fname+'\n';
    fse.moveSync(path.join(p,fname),path.join(p,'js',fname));
  });
  fs.writeFileSync(path.join(p,'js.txt'),jsContent);
  fs.writeFileSync(path.join(p,'css.txt'),cssContent);
  fs.writeFileSync(path.join(p,'.content.xml'),clientLibContentXMLContent(name));
}

const clientLibContentXMLContent = (cName) => {
  return '<?xml version="1.0" encoding="UTF-8"?>\n'+
  '<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0"\n'+
   'jcr:primaryType="cq:ClientLibraryFolder"\n'+
   'allowProxy="{Boolean}true"\n' +
   //'jsProcessor="[default:none,min:gcc;languageIn=STABLE;compilationLevel=simple]"\n'+
   'categories="['+cName+']"/>';
}

gulp.task('copy-build-files',() => {
  return gulp.src(['dist/**','dist/**/.*'])
  .pipe(gulp.dest('../ui.apps/src/main/content/jcr_root/apps/sunlife'));
});

gulp.task('dev',gulp.series('compile-files','watch','browser-sync'));
gulp.task('build:dev',gulp.series('clean','copy-files','compile-sass','compile-react',generateClientLibs,'copy-build-files','clean'));
