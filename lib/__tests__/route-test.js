/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var route = require('../route');
var Routes = route.Routes;
var Route = route.Route;

describe('Route', function() {

  describe('getTraceByName()', function() {

    var routes = (
      <Route>
        <Route name="a" />
        <Route name="b">
          <Route name="c" />
        </Route>
        <Route>
          <Route name="d" />
        </Route>
        <Route name="e">
          <Route>
            <Route name="f" />
          </Route>
        </Route>
      </Route>
    );

    it('retrieves a route by its name', function() {
      assert.deepEqual(
        route.getTraceByName(routes, 'a'),
        [
          routes,
          routes.children[0]
        ]);
      assert.deepEqual(
        route.getTraceByName(routes, 'b'),
        [
          routes,
          routes.children[1]
        ]);
      assert.deepEqual(
        route.getTraceByName(routes, 'b/c'),
        [
          routes,
          routes.children[1],
          routes.children[1].children[0]
        ]);
      assert.deepEqual(
        route.getTraceByName(routes, 'd'),
        [
          routes,
          routes.children[2],
          routes.children[2].children[0]
        ]);
      assert.deepEqual(
        route.getTraceByName(routes, 'e/f'),
        [
          routes,
          routes.children[3],
          routes.children[3].children[0],
          routes.children[3].children[0].children[0]
        ]);
    });

  });
});
