/**
 * @jsx React.DOM
 */
'use strict';

var merge = require('react/lib/merge');

/**
 * Create a view for which matches for a path with the provided routes
 *
 * @param {Route} routes
 * @returns {Promise<ReactComponent>}
 */
function createView(match) {
  var subView;
  var props;

  for (var i = match.activeTrace.length - 1; i >= 0; i--) {
    var step = match.activeTrace[i];

    if (step.route.subView !== undefined) {
      props = merge(step.props, merge(step.match, {subView}));
      subView = step.route.subView(props);
    } else if (step.route.view !== undefined) {
      props = merge(step.props, merge(step.match, {subView}));
      return step.route.view(props);
    }
  }
}

module.exports = createView;
