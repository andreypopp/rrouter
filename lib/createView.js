/**
 * @jsx React.DOM
 */
'use strict';

var mergeInto       = require('react/lib/mergeInto');
var ReactContext    = require('react/lib/ReactContext');
var thenWithNoMatch = require('./thenWithNoMatch');
var matchRoutes     = require('./matchRoutes');

function createView(routes, path, additionalContext) {
  return thenWithNoMatch(
    matchRoutes(routes, path),
    (match) => {
      if (match.route.view === undefined) {
        return undefined;
      }

      var context = {routes, route: match.route};
      if (additionalContext) {
        mergeInto(context, additionalContext);
      }

      return ReactContext.withContext(
        context,
        () => match.route.view(match.props)
      );
    });
}

module.exports = createView;
