/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var React = require('react');
var route = require('../route');
var descriptors = require('../descriptors');
var Routes = descriptors.Routes;
var Route = descriptors.Route;

describe('route', function() {

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

  it('routes /', function(done) {
    route(routes, '/').then(function(execute) {
      execute(function(view, match, navigation) {
        assert.equal(view.type.displayName, 'Main');
        assert.deepEqual(navigation, {initial: true});
        done();
      });
    }).catch(done);
  });

  it('routes /page', function(done) {
    route(routes, '/page').then(function(execute) {
      execute(function(view, match, navigation) {
        assert.equal(view.type.displayName, 'Page');
        assert.deepEqual(navigation, {initial: true});
        done();
      });
    }).catch(done);
  });

  it('routes /page?foo=bar', function(done) {
    route(routes, '/page', 'foo=bar').then(function(execute) {
      execute(function(view, match, navigation) {
        assert.equal(view.type.displayName, 'Page');
        assert.deepEqual(navigation, {initial: true});
        assert.deepEqual(match.query, {foo: 'bar'});
        done();
      });
    }).catch(done);
  });

  it('routes /page?foo=bar (parsed query)', function(done) {
    route(routes, '/page', {foo: 'bar'}).then(function(execute) {
      execute(function(view, match, navigation) {
        assert.equal(view.type.displayName, 'Page');
        assert.deepEqual(navigation, {initial: true});
        assert.deepEqual(match.query, {foo: 'bar'});
        done();
      });
    }).catch(done);
  });

});
