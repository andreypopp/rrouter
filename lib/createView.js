/**
 * @jsx React.DOM
 */
'use strict';

var mergeInto   = require('react/lib/mergeInto');
var React       = require('react');
var matchRoutes = require('./matchRoutes');

/**
 * Create a view for which matches for a path with the provided routes
 *
 * @param {Route} routes
 * @param {String} path
 * @returns {Promise<ReactComponent>}
 */
function createView(routes, path, additionalContext) {
  return matchRoutes(routes, path).then((match) => {
    // either we had no matched route or route has not view attached
    if (!match.route || !match.route.view) {
      return undefined;
    }

    var context = {routes, match};

    if (additionalContext) {
      mergeInto(context, additionalContext);
    }

    return React.withContext(context, () => match.route.view(match.props));
  });
}

module.exports = createView;
