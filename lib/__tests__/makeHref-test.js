/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var makeHref = require('../makeHref');
var getPattern = makeHref.getPattern;
var route = require('../route');
var Routes = route.Routes;
var Route = route.Route;

describe('makeHref', function() {

  describe('getPattern()', function() {

    var scoped = (
      <Routes name="e" path="/e">
        <Route>
          <Route name="f" path="/f" />
        </Route>
        <Route name="g" path="/g" />
        <Route name="h" path="/h">
          <Route name="i" path="/i" />
        </Route>
      </Routes>
    );

    var routes = (
      <Routes>
        <Route name="a" path="/" />
        <Route name="b" path="/b">
          <Route name="c" path="/c"/>
        </Route>
        <Route>
          <Route name="d" path="/d" />
        </Route>
        {scoped}
      </Routes>
    );

    it('generates href by absolute route ref', function() {
      var matchA = {
        route: routes.children[0],
        trace: route.getTraceByName(routes, 'a')
      };

      assert.equal(getPattern(routes, '/a', matchA), '/');
      assert.equal(getPattern(routes, '/b', matchA), '/b');
      assert.equal(getPattern(routes, '/b/c', matchA), '/b/c');
      assert.equal(getPattern(routes, '/d', matchA), '/d');
      assert.equal(getPattern(routes, '/e', matchA), '/e');
      assert.equal(getPattern(routes, '/e/f', matchA), '/e/f');
    });

    it('generates href by relative route ref', function() {
      var matchA = {
        route: routes.children[0],
        trace: route.getTraceByName(routes, 'a')
      };

      assert.equal(getPattern(routes, 'a', matchA), '/');

      var matchE = {
        route: routes.children[3],
        trace: route.getTraceByName(routes, 'e')
      };

      assert.equal(getPattern(routes, 'e', matchE), '/e');
      assert.equal(getPattern(routes, 'e/f', matchE), '/e/f');
      assert.equal(getPattern(routes, 'e/g', matchE), '/e/g');
      assert.equal(getPattern(routes, 'e/h', matchE), '/e/h');
      assert.equal(getPattern(routes, 'e/h/i', matchE), '/e/h/i');

      var matchH = {
        route: routes.children[3].children[2],
        trace: route.getTraceByName(routes, 'e/h')
      };

      assert.equal(getPattern(routes, 'e/h', matchH), '/e/h');
      assert.equal(getPattern(routes, 'e/h/i', matchH), '/e/h/i');
    });

  });

  describe('makeHref()', function() {

    var routes = (
      <Route>
        <Route name="a" path="/" />
        <Route name="b" path="/:lastName">
          <Route name="c" path="/:firstName"/>
        </Route>
      </Route>
    );

    it('generates link by absolute route ref', function() {
      var matchA = {
        route: routes.children[0],
        trace: route.getTraceByName(routes, 'a')
      };
      assert.equal(
        makeHref(routes, '/a', matchA, {}),
        '/');
      assert.equal(
        makeHref(routes, '/b', matchA, {lastName: 'ln'}),
        '/ln');
      assert.equal(
        makeHref(routes, '/b/c', matchA, {lastName: 'ln', firstName: 'fn'}),
        '/ln/fn');
    });


    it('generates link by relative route ref', function() {
      var matchB = {
        route: routes.children[1],
        trace: route.getTraceByName(routes, 'b')
      };
      assert.equal(
        makeHref(routes, 'b', matchB, {lastName: 'ln'}),
        '/ln');
      assert.equal(
        makeHref(routes, 'b/c', matchB, {lastName: 'ln', firstName: 'fn'}),
        '/ln/fn');
    });
  });
});
