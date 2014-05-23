/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var Promise = require('bluebird');
var matchRoutes = require('../matchRoutes');
var Route = require('../index').Route;

function ita(name, testCase) {
  return it(name, function(done) {
    return testCase().then(function() { done(); }, done);
  });
}

function itMatches(routes, path, testCase) {
  return ita(`matches ${path}`, function() {
    return matchRoutes(routes, path).then((match) => {
      assert.ok(match.route, `no match found for ${path}`);
      return testCase(match);
    });
  });
}

describe('matchRoutes', function() {

  describe('matching flat routing structures', function() {

    var routes = (
      <Route>
        <Route path="/" view="main" />
        <Route path="/users" view="users" />
        <Route path="/users/:user" view="user" />
        <Route path="/users/:user/albums" view="user-albums" />
        <Route path="/users/:user/*" view="user-everything" />
      </Route>
    );

    itMatches(routes, '/', (match) => {
      assert.deepEqual(match.route.view, 'main');
    });
  
    itMatches(routes, '/users', (match) => {
      assert.deepEqual(match.route.view, 'users');
    });
  
    itMatches(routes, '/users/me', (match) => {
      assert.deepEqual(match.route.view, 'user');
      assert.deepEqual(match.props.user, 'me');
    });
  
    itMatches(routes, '/users/me/albums', (match) => {
      assert.deepEqual(match.route.view, 'user-albums');
      assert.deepEqual(match.props.user, 'me');
    });

    itMatches(routes, '/users/me/songs', (match) => {
      assert.deepEqual(match.route.view, 'user-everything');
      assert.deepEqual(match.props.user, 'me');
      assert.deepEqual(match.props._, ['songs']);
    });
  });

  describe('matching nested routing structures', function() {

    var routes = (
      <Route>
        <Route path="/" view="main" />
        <Route path="/users" view="users">
          <Route path=":user" view="user">
            <Route path="albums" view="user-albums" />
            <Route path="*" view="user-everything" />
          </Route>
        </Route>
      </Route>
    );

    itMatches(routes, '/', (match) => {
      assert.deepEqual(match.route.view, 'main');
    });
  
    itMatches(routes, '/users', (match) => {
      assert.deepEqual(match.route.view, 'users');
    });
  
    itMatches(routes, '/users/me', (match) => {
      assert.deepEqual(match.route.view, 'user');
      assert.deepEqual(match.props.user, 'me');
    });
  
    itMatches(routes, '/users/me/albums', (match) => {
      assert.deepEqual(match.route.view, 'user-albums');
      assert.deepEqual(match.props.user, 'me');
    });

    itMatches(routes, '/users/me/songs', (match) => {
      assert.deepEqual(match.route.view, 'user-everything');
      assert.deepEqual(match.props.user, 'me');
      assert.deepEqual(match.props._, ['songs']);
    });
  });

});
