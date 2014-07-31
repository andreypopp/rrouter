/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var Promise = require('bluebird');
var React = require('react');
var PathnameRouting = require('../PathnameRouting');
var descriptors = require('../../descriptors');
var Routes = descriptors.Routes;
var Route = descriptors.Route;

function delay(func, ms) {
  setTimeout(func, ms || 10);
}

function makeOnRoute() {
  var onRoute = sinon.spy();
  onRoute.proxy = function(View, match, navigation) {
    var view = <View />;
    onRoute(view, match, navigation);
  };
  return onRoute;
}

describe('PathnameRouting', function() {

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
    window.history.pushState({}, '', '/');
  });

  it('starts routing', function(done) {
    var onRoute = makeOnRoute();
    PathnameRouting.start(routes, onRoute.proxy);
    delay(function() {
      sinon.assert.calledOnce(onRoute);
      assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
      assert.deepEqual(onRoute.firstCall.args[2], {initial: true});
      done();
    });
  });

  it('navigates to a different route', function(done) {
    var onRoute = makeOnRoute();
    var routing = PathnameRouting.start(routes, onRoute.proxy);
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
    var routing = PathnameRouting.start(routes, onRoute.proxy);
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
    var routing = PathnameRouting.start(routes, onRoute.proxy);
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

  it('reacts on popstate', function(done) {
    var onRoute = makeOnRoute();
    var routing = PathnameRouting.start(routes, onRoute.proxy);
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
    var routing = PathnameRouting.start(routes, onRoute.proxy);
    assert.equal(routing.makeHref('main'), '/');
    assert.equal(routing.makeHref('page'), '/page');
  });

});

describe('PathnameRouting with data dependencies', function() {

  var App = React.createClass({
    getDefaultProps: function() {
      return {page: Main};
    },
    render: function() {
      return <div>{this.props.page({ref: 'page'})}</div>;
    }
  });

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

  var About = React.createClass({
    render: function() {
      return <div>about</div>;
    }
  });

  function defer(value, ms) {
    var promise = new Promise((resolve) =>
      setTimeout(resolve.bind(null, value), ms));
    return promise;
  }

  var resolve = Promise.resolve.bind(Promise);

  var appDataPromise, pageDataPromise, aboutDataPromise;

  var routes = (
    <Routes name="main" path="/" view={App} appDataPromise={() => appDataPromise}>
      <Route name="page" path="/page" pageView={Page} pageDataPromise={() => pageDataPromise} />
      <Route name="about" path="/about" pageView={About} aboutDataPromise={() => aboutDataPromise} />
    </Routes>
  );

  beforeEach(function() {
    window.history.pushState({}, '', '/');
    appDataPromise = null;
    pageDataPromise = null;
    aboutDataPromise = null;
  });

  describe('initial routing with unfulfilled promises', function() {

    var onRoute;

    beforeEach(function() {
      appDataPromise = defer('appData', 50);
      pageDataPromise = defer('pageData', 70);
      aboutDataPromise = defer('aboutData', 20);
      onRoute = makeOnRoute();
    });

    it('routes to /', function(done) {
      PathnameRouting.start(routes, onRoute.proxy);
      delay(function() {
        sinon.assert.calledTwice(onRoute);
        assert.equal(onRoute.firstCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.firstCall.args[0].props.appData, undefined);
        assert.equal(onRoute.secondCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.secondCall.args[0].props.appData, 'appData');
        done();
      }, 100);
    });

    it('routes to /page', function(done) {
      window.history.pushState({}, '', '/page');
      PathnameRouting.start(routes, onRoute.proxy);
      delay(function() {
        sinon.assert.calledThrice(onRoute);
        assert.equal(onRoute.firstCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.firstCall.args[0].props.appData, undefined);
        assert.equal(onRoute.secondCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.secondCall.args[0].props.appData, 'appData');
        assert.equal(onRoute.thirdCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.thirdCall.args[0].props.appData, 'appData');
        done();
      }, 100);
    });

    it('routes to /about', function(done) {
      window.history.pushState({}, '', '/about');
      PathnameRouting.start(routes, onRoute.proxy);
      delay(function() {
        sinon.assert.calledThrice(onRoute);
        assert.equal(onRoute.firstCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.firstCall.args[0].props.appData, undefined);
        assert.equal(onRoute.secondCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.secondCall.args[0].props.appData, undefined);
        assert.equal(onRoute.thirdCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.thirdCall.args[0].props.appData, 'appData');
        done();
      }, 100);
    });
  });

  describe('initial routing with fulfilled promises', function() {

    var onRoute;

    beforeEach(function() {
      appDataPromise = resolve('appData');
      pageDataPromise = resolve('pageData');
      aboutDataPromise = resolve('aboutData');
      onRoute = makeOnRoute();
    });

    it('routes to /', function(done) {
      PathnameRouting.start(routes, onRoute.proxy);
      delay(function() {
        sinon.assert.calledOnce(onRoute);
        assert.equal(onRoute.firstCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.firstCall.args[0].props.appData, 'appData');
        done();
      }, 100);
    });

    it('routes to /page', function(done) {
      window.history.pushState({}, '', '/page');
      PathnameRouting.start(routes, onRoute.proxy);
      delay(function() {
        sinon.assert.calledOnce(onRoute);
        assert.equal(onRoute.firstCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.firstCall.args[0].props.appData, 'appData');
        done();
      }, 100);
    });

    it('routes to /about', function(done) {
      window.history.pushState({}, '', '/about');
      PathnameRouting.start(routes, onRoute.proxy);
      delay(function() {
        sinon.assert.calledOnce(onRoute);
        assert.equal(onRoute.firstCall.args[0].type.displayName, 'App');
        assert.equal(onRoute.firstCall.args[0].props.appData, 'appData');
        done();
      }, 100);
    });
  });
});
