'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var Generator = require('./mock-generator');
var generator;

var preprocessors = require('../../app/src/preprocessors.js');

describe('gulp-angular generator preprocessors script', function () {

  before(function() {
    preprocessors(Generator);
  });

  beforeEach(function() {
    generator = new Generator();

    generator.files = [
      { src: 'gulp/styles.js' },
      { src: 'gulp/scripts.js' },
      { src: 'gulp/markups.js' },
      { src: 'gulp/tsd.js' },
      { src: 'index.constants.js' },
      { src: 'tsd.json' }
    ];
  });

  describe('compute file extension processed by the generator', function() {
    it('should clean up the list and join with ,', function() {
      generator.props = {
        cssPreprocessor: { extension: null },
        jsPreprocessor: { extension: 'js' },
        htmlPreprocessor: { extension: 'jade' }
      };
      generator.imageMin = true;
      generator.computeProcessedFileExtension();
      generator.processedFileExtension.should.be.equal('html,css,js,jade,jpg,png,gif,svg');

      generator.imageMin = false;
      generator.computeProcessedFileExtension();
      generator.processedFileExtension.should.be.equal('html,css,js,jade');
    });
  });

  describe('compute dependencies for the gulp watch task', function() {
    it('should be inject if no es6 or html prepro', function() {
      generator.props = {
        jsPreprocessor: { srcExtension: 'notes6' },
        htmlPreprocessor: { key: 'none' }
      };
      generator.computeWatchTaskDeps();
      generator.watchTaskDeps.length.should.be.equal(1);
      generator.watchTaskDeps[0].should.be.equal('\'inject\'');
    });

    it('should be inject, scripts:watch and markups when needed', function() {
      generator.props = {
        jsPreprocessor: { srcExtension: 'es6' },
        htmlPreprocessor: { key: 'notnone' }
      };
      generator.computeWatchTaskDeps();
      generator.watchTaskDeps.length.should.be.equal(3);
      generator.watchTaskDeps[0].should.be.equal('\'scripts:watch\'');
      generator.watchTaskDeps[1].should.be.equal('\'markups\'');
      generator.watchTaskDeps[2].should.be.equal('\'inject\'');
    });
  });

  describe('reject files depending on preprocessors choices', function() {
    it('should reject preprocessors gulp files if no preprocessors', function() {
      generator.props = {
        cssPreprocessor: { key: 'none' },
        jsPreprocessor: { key: 'none' },
        htmlPreprocessor: { key: 'none' }
      };
      generator.rejectFiles();
      generator.files.length.should.be.equal(2);
    });

    it('should reject nothing if there is preprocessors including TypeScript', function() {
      generator.props = {
        cssPreprocessor: { key: 'not none' },
        jsPreprocessor: { key: 'typescript' },
        htmlPreprocessor: { key: 'not none' }
      };
      generator.rejectFiles();
      generator.files.length.should.be.equal(5);
    });
  });



  describe('add travis files', function() {
    it('should not add file if there is no travis env', function() {
      process.env.TRAVIS = 'false';
      generator.travisCopies();
      generator.files.length.should.be.equal(6);
    });

    it('should not add file if travis but no typescript', function() {
      process.env.TRAVIS = 'true';
      generator.props = { jsPreprocessor: { key: 'not typescript' } };
      generator.travisCopies();
      generator.files.length.should.be.equal(6);
    });

    it('should add file if travis and typescript', function() {
      process.env.TRAVIS = 'true';
      generator.props = { jsPreprocessor: { key: 'typescript' } };
      generator.travisCopies();
      generator.files.length.should.be.equal(7);
      generator.files[6].src.should.match(/tsdrc/);
    });
  });

});
