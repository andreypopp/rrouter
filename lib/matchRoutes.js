/**
 * @jsx React.DOM
 */
'use strict';

var mergeInto             = require('react/lib/mergeInto');
var pattern               = require('url-pattern');
var Promise               = require('bluebird');
var fetchDataDependencies = require('./fetchDataDependencies');

/**
 * Normalize path
 *
 * @param {String} path
 * @returns {String}
 */
function normalize(path) {
  if (!path) {
    return '/';
  }
  if (path[0] !== '/') {
    path = '/' + path;
  }
  if (path[path.length - 1] !== '/') {
    path = path + '/';
  }
  return path;
}

/**
 * Match route against path
 *
 * @param {Route} route
 * @param {String} path
 * @returns {Match|Null}
 */
function matchRoute(route, path) {
  if (!route.pattern && route.path) {
    var routePath = normalize(route.path);
    Object.defineProperty(route, 'pattern', {
      enumerable: false,
      value: pattern.newPattern(route.children.length > 0 ?
        routePath + '*' :
        routePath)
    });
  }

  if (route.pattern) {
    return route.pattern.match(path);
  } else {
    return {_: [path]};
  }
}

function matchRoutes(routes, path, props) {
  routes = Array.isArray(routes) ? routes : [routes];
  path = normalize(path);
  props = props || {};

  for (var i = 0, len = routes.length; i < len; i++) {
    var route = routes[i];
    var m = matchRoute(route, path);

    if (!m) {
      continue;
    }

    var nextProps = {};
    mergeInto(nextProps, props);
    mergeInto(nextProps, route.props);
    mergeInto(nextProps, m);

    if (m._ && m._[0] && route.children.length > 0) {
      return matchRoutes(route.children, m._[0], nextProps);
    } else {
      return fetchDataDependencies(nextProps).then((props) => {
        return {route, props};
      });
    }
  }

  var promise = Promise.resolve(noMatch);
  // we assign noMatch directly on promise to allow synchronous inspection
  promise.noMatch = true;
  return promise;
}

/**
 * Used as a return value when no match is found
 */
var noMatch = {
  route: undefined,
  props: {}
};

module.exports = matchRoutes;
