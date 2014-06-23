/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var descriptors = require('../descriptors');
var Routes = descriptors.Routes;
var Route = descriptors.Route;

describe('Route', function() {

  describe('creating routes', function() {

    it('creates routes from arguments', function() {
      var routes = (
        <Routes>
          <Route name="a" />
          <Route name="b" />
        </Routes>
      );
      assert.equal(routes.children.length, 2);
    });

    it('creates routes from an array', function() {
      var subroutes = [
        <Route name="a" />,
        <Route name="b" />
      ];
      var routes = (
        <Routes>
          {subroutes}
          <Route name="c" />
        </Routes>
      );
      assert.equal(routes.children.length, 3);
    });

    it('creates routes with RegExp', function() {
      var routes = (
        <Routes>
          <Route path={/a/} />
        </Routes>
      );
      assert(routes.children[0].path instanceof RegExp);
    });

  });

  describe('getTraceByName()', function() {

    var routes = (
      <Routes>
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
      </Routes>
    );

    it('retrieves a route by its name', function() {
      assert.deepEqual(
        descriptors.getTraceByName(routes, 'a'),
        [
          routes,
          routes.children[0]
        ]);
      assert.deepEqual(
        descriptors.getTraceByName(routes, 'b'),
        [
          routes,
          routes.children[1]
        ]);
      assert.deepEqual(
        descriptors.getTraceByName(routes, 'b/c'),
        [
          routes,
          routes.children[1],
          routes.children[1].children[0]
        ]);
      assert.deepEqual(
        descriptors.getTraceByName(routes, 'd'),
        [
          routes,
          routes.children[2],
          routes.children[2].children[0]
        ]);
      assert.deepEqual(
        descriptors.getTraceByName(routes, 'e/f'),
        [
          routes,
          routes.children[3],
          routes.children[3].children[0],
          routes.children[3].children[0].children[0]
        ]);
    });

  });
});
