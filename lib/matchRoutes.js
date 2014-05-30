/**
 * @jsx React.DOM
 */
'use strict';

var pattern = require('url-pattern');
var Promise = require('bluebird');
var hasView = require('./route').hasView;

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
    var match = route.pattern.match(path);

    if (match
        && (!match._ || match._[0] === '/' || match._[0] === '')) {
      delete match._;
    }

    return match;

  } else {
    return path === '/' || path === '' ? {} : {_: [path]};
  }
}

function matchRoutesImpl(routes, path, trace, activeTrace, originalPath) {
  routes = Array.isArray(routes) ? routes : [routes];
  trace = trace || [];
  activeTrace = activeTrace || [];
  originalPath = originalPath === undefined ? path : originalPath;

  for (var i = 0, len = routes.length; i < len; i++) {
    var route = routes[i];
    var match = matchRoute(route, normalize(path));

    if (!match) {
      continue;
    }

    var step = {route, match};

    trace = trace.concat(step);

    activeTrace = route.view !== undefined ?
      [step] : activeTrace.concat(step);

    if ((match._ || !hasView(route)) && route.children && route.children.length > 0) {
      return matchRoutesImpl(
        route.children, match._ ? match._[0] : '/',
        trace, activeTrace, originalPath);
    } else {
      return {path: originalPath, route, trace, activeTrace};
    }
  }

  return {
    path: originalPath,
    route: undefined,
    trace: [],
    activeTrace: []
  };
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

module.exports = matchRoutes;
