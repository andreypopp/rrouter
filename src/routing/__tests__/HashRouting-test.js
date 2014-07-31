/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var React = require('react');
var HashRouting = require('../HashRouting');
var descriptors = require('../../descriptors');
var Routes = descriptors.Routes;
var Route = descriptors.Route;

function delay(func) {
  setTimeout(func, 10);
}

function makeOnRoute() {
  var onRoute = sinon.spy();
  onRoute.proxy = function(View, match, navigation) {
    var view = <View />;
    onRoute(view, match, navigation);
  };
  return onRoute;
}

describe('HashRouting', function() {

  var Main = React.createClass({
    render: function() {
      return <div>main</div>;
    }
  });

  var Page = React.createClass({
    render: function() {
      return <div>page</div>;
    }
  });

  var routes = (
    <Routes>
      <Route name="main" path="/" view={Main} />
      <Route name="page" path="/page" view={Page} />
    </Routes>
  );

  beforeEach(function() {
    window.location.hash = '';
  });

  it('starts routing', function(done) {
    var onRoute = makeOnRoute();
    HashRouting.start(routes, onRoute.proxy);
    delay(function() {
      sinon.assert.calledOnce(onRoute);
      assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
      assert.deepEqual(onRoute.firstCall.args[2], {initial: true});
      done();
    });
  });

  it('navigates to a different route', function(done) {
    var onRoute = makeOnRoute();
    var routing = HashRouting.start(routes, onRoute.proxy);
    delay(function() {
      routing.navigate('/page');
      delay(function() {
        sinon.assert.calledTwice(onRoute);
        assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
        assert.equal(onRoute.secondCall.args[0].type.displayName, 'Page');
        done();
      });
    });
  });

  it('navigates to a different route with custom navigation params', function(done) {
    var onRoute = makeOnRoute();
    var routing = HashRouting.start(routes, onRoute.proxy);
    delay(function() {
      routing.navigate('/page', {foo: 'bar'});
      delay(function() {
        sinon.assert.calledTwice(onRoute);
        assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
        assert.equal(onRoute.secondCall.args[0].type.displayName, 'Page');
        assert.deepEqual(onRoute.secondCall.args[2], {foo: 'bar'});
        done();
      });
    });
  });

  it('navigates to a different route when query string changes', function(done) {
    var onRoute = makeOnRoute();
    var routing = HashRouting.start(routes, onRoute.proxy);
    delay(function() {
      routing.navigate('/page');
      routing.navigate('/page?foo=bar');
      delay(function() {
        sinon.assert.calledThrice(onRoute);
        assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
        assert.deepEqual(onRoute.firstCall.args[0].props, {query: {}});
        assert.equal(onRoute.secondCall.args[0].type.displayName, 'Page');
        assert.deepEqual(onRoute.secondCall.args[0].props, {query: {}});
        assert.equal(onRoute.thirdCall.args[0].type.displayName, 'Page');
        assert.deepEqual(onRoute.thirdCall.args[0].props, {query: {foo: 'bar'}});
        done();
      });
    });
  });

  it('reacts on hashchange', function(done) {
    var onRoute = makeOnRoute();
    var routing = HashRouting.start(routes, onRoute.proxy);
    delay(function() {
      routing.navigate('/page');
      delay(function() {
        window.history.back();
        delay(function() {
          sinon.assert.callCount(onRoute, 3);
          assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
          assert.equal(onRoute.secondCall.args[0].type.displayName, 'Page');
          assert.equal(onRoute.thirdCall.args[0].type.displayName, 'Main');
          assert.deepEqual(onRoute.thirdCall.args[2], {back: true});
          done();
        });
      });
    });
  });

  it('generates href', function() {
    var onRoute = makeOnRoute();
    var routing = HashRouting.start(routes, onRoute.proxy);
    assert.equal(routing.makeHref('main'), '#/');
    assert.equal(routing.makeHref('page'), '#/page');
  });

});

