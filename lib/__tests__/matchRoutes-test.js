/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var matchRoutes = require('../matchRoutes');
var Route = require('../index').Route;

function ita(name, testCase) {
  return it(name, function(done) {
    return testCase().then(function() { done(); }, done);
  });
}

function itMatches(routes, path, testCase) {
  return ita(`matches ${path}`, function() {
    var promise = matchRoutes(routes, path).then((match) => {
      assert.ok(match.route, `no match found for ${path}`);
      return testCase(match);
    });
    assert.ok(
      !promise.noMatch,
      'sync inspection of promise.noMatch should be falsy'
    );
    return promise;
  });
}

describe('matchRoutes', function() {

  describe('matching flat routing structures', function() {
  
    var routes = (
      <Route>
        <Route path="/" view="main" />
        <Route path="/users" a="a" view="users" />
        <Route path="/users/:user" b="b" view="user" />
        <Route path="/users/:user/albums" c="c" view="user-albums" />
        <Route path="/users/:user/*" view="user-everything" />
      </Route>
    );
  
    itMatches(routes, '/', (match) => {
      assert.deepEqual(match.route.view, 'main');
      assert.deepEqual(match.props, {
        _: undefined
      });
    });
  
    itMatches(routes, '/users', (match) => {
      assert.deepEqual(match.route.view, 'users');
      assert.deepEqual(match.props, {
        a: 'a',
        _: undefined
      });
    });
  
    itMatches(routes, '/users/me', (match) => {
      assert.deepEqual(match.route.view, 'user');
      assert.deepEqual(match.props, {
        user: 'me',
        b: 'b',
        _: undefined
      });
    });
  
    itMatches(routes, '/users/me/albums', (match) => {
      assert.deepEqual(match.route.view, 'user-albums');
      assert.deepEqual(match.props, {
        user: 'me',
        c: 'c',
        _: undefined
      });
    });
  
    itMatches(routes, '/users/me/songs', (match) => {
      assert.deepEqual(match.route.view, 'user-everything');
      assert.deepEqual(match.props, {
        user: 'me',
        _: ['songs']
      });
    });
  });
  
  describe('matching nested routing structures', function() {
  
    var routes = (
      <Route>
        <Route path="/" view="main" />
        <Route path="/users" a="a" view="users">
          <Route path=":user" b="b" view="user">
            <Route path="albums" c="c" view="user-albums" />
            <Route path="*" view="user-everything" />
          </Route>
        </Route>
      </Route>
    );
  
    itMatches(routes, '/', (match) => {
      assert.deepEqual(match.route.view, 'main');
      assert.deepEqual(match.props, {
        _: undefined
      });
    });
  
    itMatches(routes, '/users', (match) => {
      assert.deepEqual(match.route.view, 'users');
      assert.deepEqual(match.props, {
        a: 'a',
        _: undefined
      });
    });
  
    itMatches(routes, '/users/me', (match) => {
      assert.deepEqual(match.route.view, 'user');
      assert.deepEqual(match.props, {
        user: 'me',
        a: 'a',
        b: 'b',
        _: undefined
      });
    });
  
    itMatches(routes, '/users/me/albums', (match) => {
      assert.deepEqual(match.route.view, 'user-albums');
      assert.deepEqual(match.props, {
        user: 'me',
        a: 'a',
        b: 'b',
        c: 'c',
        _: undefined
      });
    });
  
    itMatches(routes, '/users/me/songs', (match) => {
      assert.deepEqual(match.route.view, 'user-everything');
      assert.deepEqual(match.props, {
        user: 'me',
        a: 'a',
        b: 'b',
        _: ['songs']
      });
    });
  });
  
  describe('matching decomposed nested routing structures', function() {
  
    var usersRoutes = (
      <Route path="/" a="a" view="users">
        <Route path=":user" b="b" view="user">
          <Route path="albums" c="c" view="user-albums" />
          <Route path="*" view="user-everything" />
        </Route>
      </Route>
    );
  
    var routes = (
      <Route>
        <Route path="/" view="main" />
        <Route path="/users">
          {usersRoutes}
        </Route>
      </Route>
    );
  
    itMatches(routes, '/', (match) => {
      assert.deepEqual(match.route.view, 'main');
      assert.deepEqual(match.props, {
        _: undefined
      });
    });
  
    itMatches(routes, '/users', (match) => {
      assert.deepEqual(match.route.view, 'users');
      assert.deepEqual(match.props, {
        a: 'a',
        _: undefined
      });
    });
  
    itMatches(routes, '/users/me', (match) => {
      assert.deepEqual(match.route.view, 'user');
      assert.deepEqual(match.props, {
        user: 'me',
        a: 'a',
        b: 'b',
        _: undefined
      });
    });
  
    itMatches(routes, '/users/me/albums', (match) => {
      assert.deepEqual(match.route.view, 'user-albums');
      assert.deepEqual(match.props, {
        user: 'me',
        a: 'a',
        b: 'b',
        c: 'c',
        _: undefined
      });
    });
  
    itMatches(routes, '/users/me/songs', (match) => {
      assert.deepEqual(match.route.view, 'user-everything');
      assert.deepEqual(match.props, {
        user: 'me',
        a: 'a',
        b: 'b',
        _: ['songs']
      });
    });
  });

});
