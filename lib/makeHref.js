/**
 * @jsx React.DOM
 */
'use strict';

var invariant       = require('./invariant');
var getTraceByName  = require('./route').getTraceByName;

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
  var trace = getScopedTrace(routes, name, match);

  invariant(
    trace !== undefined && trace.length > 0,
    'cannot resolve "%s" route reference', name
  );

  var href = '';
  for (var i = 0, len = trace.length; i < len; i++) {
    var route = trace[i];
    if (route.path && route.path.length > 0) {
      href = href + '/' + route.path;
    }
  }

  return href === '' ? '/' : href;
}

function getScopedTrace(routes, name, match) {
  if (name[0] === '/') {
    return getTraceByName(routes, name.slice(1));
  } else {
    var trace = match.trace.map((step) => step.route);
    var scope = trace[0];

    for (var i = trace.length - 1; i >= 0; i--) {
      if (trace[i].__scope) {
        scope = trace[i];
        break;
      }
    }

    return trace
      .slice(0, i)
      .concat(getTraceByName(scope, name));
  }
}

module.exports = makeHref;
module.exports.getPattern = getPattern;
