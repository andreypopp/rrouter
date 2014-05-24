/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var React = require('react');
var HashRouting = require('../HashRouting');
var route = require('../../route');
var Routes = route.Routes;
var Route = route.Route;

function delay(func) {
  setTimeout(func, 10);
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
      <Route path="/" view={Main} />
      <Route path="/page" view={Page} />
    </Routes>
  );

  beforeEach(function() {
    window.location.hash = '';
  });

  it('starts routing', function(done) {
    var onRoute = sinon.spy();
    var routing = HashRouting.start(routes, onRoute);
    delay(function() {
      sinon.assert.calledOnce(onRoute);
      assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
      done();
    });
  });

  it('navigates to a different route', function(done) {
    var onRoute = sinon.spy();
    var routing = HashRouting.start(routes, onRoute);
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

  it('reacts on popstate', function(done) {
    var onRoute = sinon.spy();
    var routing = HashRouting.start(routes, onRoute);
    delay(function() {
      routing.navigate('/page');
      delay(function() {
        window.history.back();
        delay(function() {
          sinon.assert.callCount(onRoute, 3);
          assert.equal(onRoute.firstCall.args[0].type.displayName, 'Main');
          assert.equal(onRoute.secondCall.args[0].type.displayName, 'Page');
          assert.equal(onRoute.thirdCall.args[0].type.displayName, 'Main');
          done();
        });
      });
    });
  });

});

