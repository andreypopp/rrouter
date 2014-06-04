/**
 * @jsx React.DOM
 */
'use strict';

var assert          = require('assert');
var sinon           = require('sinon');
var createView      = require('../createView');
var getViewProps    = createView.getViewProps;

describe('createView', function() {

  describe('getViewProps()', function() {

    it('extracts view props from props', function() {
      var props = {
        a: 'a',
        bView: 'bView',
        someSuperView: 'someSuperView'
      };

      assert.deepEqual(getViewProps(props), {
        views: {
          b: 'bView',
          someSuper: 'someSuperView'
        },
        props: {
          a: 'a'
        }
      });
    });

    it('throws error when attempting to overwrite a regular property with a view property', function() {
      var props = {
        a: 'a',
        b: 'b',
        bView: 'bView'
      };

      assert.throws(function() {
        getViewProps(props);
      }, Error);
    });
  });

  function genView(name) {
    function view(props) {
      view.spy(props);
      if (props) {
        for (var k in props) {
          if (typeof props[k] === 'function') {
            props[k]();
          }
        }
      }
      return name;
    }
    view.name = name;
    view.spy = sinon.spy();
    return view;
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
    sinon.assert.calledWith(view.spy, {a: 'a'});
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
    sinon.assert.calledWith(view.spy, {a: 'a'});
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
    sinon.assert.calledOnce(view.spy);
    assert.deepEqual(Object.keys(view.spy.firstCall.args[0]), ['sub']);
    sinon.assert.calledOnce(subView.spy);
    assert.deepEqual(Object.keys(subView.spy.firstCall.args[0]), []);
  });

  it('creates view with nested subviews', function() {
    var view = genView('view');
    var subView = genView('subView');
    var subSubView = genView('subSubView');

    var match = {
      activeTrace: [
        {route: {view}},
        {route: {}, props: {subView, subProp: 'subProp'}},
        {route: {}, props: {subSubView, subSubProp: 'subSubProp'}}
      ]
    };
    var v = createView(match);

    assert.equal(v, 'view');
    sinon.assert.calledOnce(view.spy);
    assert.deepEqual(Object.keys(view.spy.firstCall.args[0]), ['subSub', 'sub']);
    sinon.assert.calledOnce(subView.spy);
    assert.deepEqual(Object.keys(subView.spy.firstCall.args[0]), ['subProp', 'subSub']);
    sinon.assert.calledTwice(subSubView.spy);
    assert.deepEqual(Object.keys(subSubView.spy.firstCall.args[0]), ['subSubProp']);
    assert.deepEqual(Object.keys(subSubView.spy.secondCall.args[0]), ['subSubProp']);
  });

  it('creates view with multiple subviews at a single step', function() {
    var view = genView('view');
    var subView = genView('subView');
    var sub2View = genView('sub2View');

    var match = {
      activeTrace: [
        {route: {view}},
        {route: {}, props: {subView, sub2View, subProp: 'subProp'}}
      ]
    };
    var v = createView(match);

    assert.equal(v, 'view');
    sinon.assert.calledOnce(view.spy);
    assert.deepEqual(Object.keys(view.spy.firstCall.args[0]), ['sub', 'sub2']);
    sinon.assert.calledOnce(subView.spy);
    assert.deepEqual(Object.keys(subView.spy.firstCall.args[0]), ['subProp']);
    sinon.assert.calledOnce(sub2View.spy);
    assert.deepEqual(Object.keys(sub2View.spy.firstCall.args[0]), ['subProp']);
  });

});
