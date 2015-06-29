/**
 * Created by Sai on 6/15/15.
 */
module.exports = function() {
    var src = 'src/';
    var srcApp = src + 'app/';
    var report = 'report/';
    var root = './';
    var serve = 'serve/';
    var serveApp = serve + 'app/';
    var temp = '.tmp';
    var config = {
        /**
         * Files paths
         */
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        dist: './dist/',
        src: src,
        srcDir: 'src',
        srcApp: srcApp,
        css: temp + '/styles.css',
        fonts: './bower_components/font-awesome/fonts/**/*.*',
        html: srcApp + '**/*.html',
        srcOneLevelHTML: src+'*.html',
        srcAllHTML: src + '**/*.html',
        srcHTML:src+ '*.html',
        appCSS: srcApp+'**/*.css',
        appStyl: srcApp+'**/*.styl',
        appJS: srcApp + '**/*.js',
        assetsJS: src + 'assets/**/*.js',
        assetsOffersJS: src + 'assets/img/offers/**/*.js',
        appSpecJS: srcApp + '**/*.spec.js',
        appMockJS: srcApp +'/app/**/*.mock.js',
        srcJS: src + '**/*.js',
        srcSpecJS: src + '**/*.spec.js',
        srcMockJS: src +'app/**/*.mock.js',
        tempServeHTML: temp+'/serve/*.html',
        tempServe: temp + '/serve',
        tempServeApp: temp + '/serve/app/',
        tempServeAppStyles: temp + '/serve/app/styles/',
        htmltemplates: srcApp + '**/*.html',
        partialsDestination:temp+'/partials/',
        templateCachePath: temp+'/partials/'+'templateCacheHtml.js',
        images: src + 'images/**/*.*',
        index: src+'index.html',
        js: [
            srcApp + '**/*.module.js',
            srcApp + '**/*.js',
            '!' + srcApp + '**/*.spec.js'
        ],
        stylus: src + 'styles/styles.styl',
        report: report,
        root: root,
        temp: temp,
        filter:{
            html : '*.html',
            js   : '**/*.js',
            css :  '**/*.css'
        },
        distFonts: './dist/fonts/',
        fontFilter:'**/*.{eot,svg,ttf,woff,woff2}',
        others:{
            everything: src + '**/*',
            allNonTypes: '!' + src + '**/*.{html,css,js,styl}'
        },
        e2ejs: 'e2e/**/*.js',
        inject: {
            tempCSS: temp + '/serve/app/styles/**/*.css',
            tempNonVendorCSS: '!' + temp + '/serve/app/styles/vendor.css',
            mainCSS:  temp + '/serve/app/styles/main.css',
            customThemeCSS: temp + '/serve/app/styles/custom-theme.css'
        },
        styles:{
            allStyles:  src + 'app/**/*.styl',
            indexStyle: src + 'app/index.styl',
            vendorStyle: src+ 'app/vendor.styl'
        },
        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },
        browserReloadDelay: 1000,

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        packages : [
            './package.json',
            './bower.json'
        ],
        app_files: {
          ctpl: ['./src/**/*.tpl.html', './src/app/html/**/*.html', '!./src/index.tpl.html']

        },
        appUtils:    './src/app/utils',
        appstylus:   './src/css/main.styl',
        otherStyles: './src/styles/**/*.css',
        srcStyles: {
            allStyles: ['./src/styles/**/*.css','./src/css/**/*.styl']
        },
        config_json: './src/app/**/*config.json',
        config_yml:  './src/app/**/*.yml',
        sprite: {
            imgSrc:         ['./src/assets/img/sparkpay/sprite/*.png'],
            cssTemplate:    './src/assets/stylus.template.mustache',
            imgDest:        './src/assets/img/sparkpay/',
            cssDest:        './src/css/site/sprite/',
            spriteSrc:      './src/assets/img/sprite/*.png',
            assetsImgDest:  './src/assets/img/',
            appSpriteDest:    './src/css/app/sprite/'

        },
      jshint:{
        src: [ srcApp + '**/*.js','!'+'./src/app/utils/*.js','!'+'./src/app/html/ui-bootstrap/datapicker.js','!'+
        './src/app/bundle/validatorBundle/service/built-in-validation-rules.js','!'+
        './src/app/bundle/appBundle/entity/ImageEntity.js','!'+
        './src/app/bundle/appBundle/filters/ch.filters.js','!'+
        './src/app/bundle/appBundle/filters/ch.filters.js']
      }





    };
    return config;
};
