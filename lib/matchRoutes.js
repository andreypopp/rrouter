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
  if (route.pattern === undefined && route.path !== undefined) {
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

function matchRoutesImpl(routes, path, props, trace) {
  routes = Array.isArray(routes) ? routes : [routes];
  path = normalize(path);
  props = props || {};
  trace = trace || [];

  for (var i = 0, len = routes.length; i < len; i++) {
    var route = routes[i];
    var m = matchRoute(route, path);

    if (!m) {
      continue;
    }

    // so that _ doesn't appear where not needed
    m._ = !m._ || m._[0] === '/' || m._[0] === '' ? undefined : m._;

    var nextProps = {};
    mergeInto(nextProps, props);
    mergeInto(nextProps, route.props);
    mergeInto(nextProps, m);

    trace = trace.concat(route);

    if ((m._ && m._[0] || route.view === undefined)
        && route.children.length > 0) {
      return matchRoutesImpl(route.children, m._ ? m._[0] : '/', nextProps, trace);
    } else {
      return fetchDataDependencies(nextProps).then((props) => {
        return {route, props, trace};
      });
    }
  }

  return Promise.resolve(noMatch);
}

/**
 * Match routes against path
 *
 * @param {Route} routes
 * @param {String} path
 * @returns {Match}
 */
function matchRoutes(routes, path) {
  return matchRoutesImpl(routes, path);
}

/**
 * Used as a return value when no match is found
 */
var noMatch = {
  route: undefined,
  trace: [],
  props: {}
};

module.exports = matchRoutes;
