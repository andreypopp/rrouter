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
function createView(routes, path) {
  return matchRoutes(routes, path).then((match) => {
    // either we had no matched route or route has not view attached
    if (!match.route || !match.route.view) {
      return undefined;
    }

    return React.withContext({routes, match}, () => {
      return {
        routes: routes,
        match: match,
        view: match.route.view(match.props)
      }
    });
  });
}

module.exports = createView;
