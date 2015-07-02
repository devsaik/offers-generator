'use strict';
/* jshint expr:true */

var inception = require('../inception');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var prompts = require('../../app/src/mock-prompts.js').prompts;

describe('gulp-angular generator inception tests', function () {
  var gulpAngular;

  this.timeout(100000);

  describe('with default prompts', function () {
    before(function() {
      return inception.prepare({}, {}).then(function(generator) {
        gulpAngular = generator;
      });
    });

    it('should pass build', function () {
      return inception.run(gulpAngular, 'build').should.be.fulfilled;
    });
    it('should pass test', function () {
      return inception.run(gulpAngular, 'test').should.be.fulfilled;
    });
    it('should pass protractor', function () {
      return inception.run(gulpAngular, 'protractor').should.be.fulfilled;
    });
    it('should pass protractor:dist', function () {
      return inception.run(gulpAngular, 'protractor:dist').should.be.fulfilled;
    });
  });

});
