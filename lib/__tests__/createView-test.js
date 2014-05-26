/**
 * @jsx React.DOM
 */
'use strict';

var assert     = require('assert');
var sinon      = require('sinon');
var createView = require('../createView');
var getViews   = createView.getViews;

describe('createView', function() {

  describe('getViews()', function() {

    it('extracts view props from props', function() {
      var props = {
        a: 'a',
        bView: 'bView',
        someSuperView: 'someSuperView'
      };

      assert.deepEqual(getViews(props), {
        bView: 'bView',
        someSuperView: 'someSuperView'
      });
    });
  });

  function genView(name) {
    var spy = sinon.stub().returns(name);
    spy.name = name;
    return spy;
  }

  it('creates view', function() {
    var view = genView('view');

    var match = {
      activeTrace: [
        {route: {view}, props: {a: 'a'}}
      ]
    };

    var v = createView(match);
    assert.equal(v, 'view');
    sinon.assert.calledWith(view, {a: 'a'});
  });

  it('ignores views up the trace from the first view', function() {
    var view = genView('view');
    var view2 = genView('view2');

    var match = {
      activeTrace: [
        {route: {view: view2}, props: {a2: 'a2'}},
        {route: {view}, props: {a: 'a'}}
      ]
    };

    var v = createView(match);
    assert.equal(v, 'view');
    sinon.assert.calledWith(view, {a: 'a'});
  });

  it('creates view with subviews', function() {
    var view = genView('view');
    var subView = genView('subView');

    var match = {
      activeTrace: [
        {route: {view}},
        {route: {}, props: {subView}}
      ]
    };
    var v = createView(match);

    assert.equal(v, 'view');
    sinon.assert.calledWith(view, {subView: 'subView'});
    sinon.assert.calledWith(subView, {subView});
  });

  it('creates view with nested subviews', function() {
    var view = genView('view');
    var subView = genView('subView');
    var subSubView = genView('subSubView');

    var match = {
      activeTrace: [
        {route: {view}},
        {route: {}, props: {subView, subProp: 'subProp'}},
        {route: {}, props: {subSubView, subSubProp: 'subSubProp'}},
      ]
    };
    var v = createView(match);

    assert.equal(v, 'view');
    sinon.assert.calledWith(
      view,
      {subView: 'subView', subSubView: 'subSubView'}
    );
    sinon.assert.calledWith(
      subView,
      {subView, subSubView: 'subSubView', subProp: 'subProp'}
    );
    sinon.assert.calledWith(
      subSubView,
      {subSubView, subSubProp: 'subSubProp'}
    );
  });

  it('creates view with multiple subviews at a single step', function() {
    var view = genView('view');
    var subView = genView('subView');
    var sub2View = genView('sub2View');

    var match = {
      activeTrace: [
        {route: {view}},
        {route: {}, props: {subView, sub2View, subProp: 'subProp'}},
      ]
    };
    var v = createView(match);

    assert.equal(v, 'view');
    sinon.assert.calledWith(
      view,
      {subView: 'subView', sub2View: 'sub2View'}
    );
    sinon.assert.calledWith(
      subView,
      {subView, sub2View, subProp: 'subProp'}
    );
    sinon.assert.calledWith(
      sub2View,
      {subView, sub2View, subProp: 'subProp'}
    );
  });

});
