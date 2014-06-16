/**
 * @jsx React.DOM
 */
'use strict';

var merge = require('./merge');

var slashes = /(^\/)|(\/$)/g;

/**
 * Route desriptor constructor
 *
 * @param {Object} props
 * @param {Object...} children
 * @returns {Route}
 */
function Route(props) {
  props = props || {};

  var path = props.path;

  if (typeof path === 'string') {
    path = path.replace(slashes, '');
  }

  delete props.path;

  var view = props.view;
  delete props.view;

  var viewPromise = props.viewPromise;
  delete props.viewPromise;

  var name = props.name;
  delete props.name;

  var __scope = props.__scope;
  delete props.__scope;

  var args = Array.prototype.slice.call(arguments, 1);

  var children = [];

  // so we support passing routes as arguments and arrays
  for (var i = 0, len = args.length; i < len; i++) {
    if (Array.isArray(args[i])) {
      children = children.concat(args[i]);
    } else {
      children.push(args[i]);
    }
  }

  var route = {path, name, view, viewPromise, props, children, __scope};
  buildNameIndex(route);
  return route;
}

function Routes(props) {
  props = merge(props, {__scope: true});
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift(props);
  return Route.apply(null, args);
}

function buildNameIndex(route) {
  if (route.__nameIndex !== undefined) {
    return;
  }

  var index = {};
  var prefix = route.name ? route.name + '/' : '';

  if (route.children && route.children.length > 0) {
    for (var i = 0, len = route.children.length; i < len; i++) {
      var r = route.children[i];
      buildNameIndex(r);
      for (var name in r.__nameIndex) {
        index[prefix + name] = [route].concat(r.__nameIndex[name]);
      }
    }
  }
  
  if (route.name !== undefined) {
    index[route.name] = [route];
  }

  Object.defineProperty(route, '__nameIndex', {
    enumerable: false,
    value: index
  });
}

function getTraceByName(route, name) {
  return route.__nameIndex[name];
}

function hasView(route) {
  return route.view !== undefined || route.viewPromise !== undefined;
}

function isRoutes(routes) {
  return (
    routes.hasOwnProperty('path')
    && routes.hasOwnProperty('view')
    && routes.hasOwnProperty('props')
    && routes.hasOwnProperty('children')
  );
}

module.exports = {
  Route,
  Routes,
  isRoutes,
  getTraceByName,
  hasView
};
