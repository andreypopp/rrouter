/**
 * @jsx React.DOM
 */
'use strict';

var Route = require('./Route');

function makeHref(routes, name, match, params) {
  params = params || {};
  var pattern = getPattern(routes, name, match);
  // TODO: handle optional and splat params
  return pattern.replace(
    /:[a-zA-Z0-9_]+/g,
    (name) => params[name.slice(1)]
  );
}

function getPattern(routes, name, match) {
  var trace = name[0] === '/' ?
    Route.getTraceByName(routes, name.slice(1)) :
    match.trace.concat(Route.getTraceByName(match.route, name).slice(1));

  var href = '';
  for (var i = 0, len = trace.length; i < len; i++) {
    var route = trace[i];
    if (route.path && route.path.length > 0) {
      href = href + '/' + route.path;
    }
  }

  return href === '' ? '/' : href;
}

module.exports = makeHref;
module.exports.getPattern = getPattern;
