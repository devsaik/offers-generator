'use strict';
/* jshint expr:true */

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var _ = require('lodash');

var Generator = require('./mock-generator');
var generator;

var prompts = require('../../app/src/prompts.js');
var promptsJson = require('../../app/prompts.json');
var mockPrompts = require('../../app/src/mock-prompts.js');

describe('gulp-angular generator prompts script', function () {

  before(function() {
    prompts(Generator);
  });

  beforeEach(function() {
    generator = new Generator();
  });

  describe('handle default option', function () {
    it('should ignore default if option not set', function() {
      sinon.spy(generator, 'log');
      generator.defaultOption();
      generator.props.should.be.deep.equal({});
      generator.log.should.have.not.been.called;
    });

    it('should use default props if option is set', function() {
      sinon.spy(generator, 'log');
      generator.options['default'] = true;
      generator.defaultOption();
      generator.props.should.be.deep.equal(mockPrompts.defaults);
      var logLines = 3 + _.flatten(_.values(generator.props)).length;
      generator.log.should.have.been.callCount(logLines);
    });
  });

  describe('check and ask for .yo-rc', function () {
    it('should ignore .yo-rc if not found', function() {
      sinon.stub(generator.config, 'get').returns(null);
      sinon.spy(generator, 'prompt');
      generator.checkYoRc();
      generator.prompt.should.have.not.been.called;
    });

    it('should ask to use .yo-rc if found and do nothing if refused', function() {
      sinon.stub(generator.config, 'get').returns(mockPrompts.defaults);
      sinon.stub(generator, 'prompt').callsArgWith(1, { skipConfig: false });
      generator.checkYoRc();
      generator.prompt.should.have.been.called;
      generator.props.should.be.deep.equal({});
    });

    it('should ask to use .yo-rc if found and use them if accepted', function() {
      sinon.stub(generator.config, 'get').returns(mockPrompts.defaults);
      sinon.stub(generator, 'prompt').callsArgWith(1, { skipConfig: true });
      generator.checkYoRc();
      generator.prompt.should.have.been.called;
      generator.props.should.be.deep.equal(mockPrompts.defaults);
    });
  });

  describe('ask for all standard questions', function () {
    it('should ask all questions', function() {
      sinon.stub(generator, 'prompt').callsArgWith(1, { ui: { key: 'none' } });
      generator.askQuestions();
      generator.prompt.should.have.been.called;
      //generator.props.bootstrapComponents.should.be.an('object');
      //generator.props.foundationComponents.should.be.an('object');
    });

    it('should not override bootstrapComponents if bootstrap', function() {
      sinon.stub(generator, 'prompt').callsArgWith(1, { ui: { key: 'bootstrap' } });
      generator.askQuestions();
      chai.expect(generator.props.bootstrapComponents).to.be.undefined;
    });

    it('should not override foundationComponents if foundation', function() {
      sinon.stub(generator, 'prompt').callsArgWith(1, { ui: { key: 'foundation' } });
      generator.askQuestions();
      chai.expect(generator.props.foundationComponents).to.be.undefined;
    });

    it('should skip all if skipConfig', function() {
      generator.skipConfig = true;
      sinon.spy(generator, 'prompt');
      generator.askQuestions();
      generator.prompt.should.not.have.been.called;
    });

    it('should set when functions which check for ui choice', function() {
      generator.askQuestions();

    });
  });



});
