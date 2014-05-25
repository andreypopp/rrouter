/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var merge = require('react/lib/merge');

/**
 * Create a view for which matches for a path with the provided routes
 *
 * @param {Route} routes
 * @returns {Promise<ReactComponent>}
 */
function createView(match) {
  var subView = undefined;

  for (var i = match.activeTrace.length - 1; i >= 0; i--) {
    var step = match.activeTrace[i];

    if (step.route.subView !== undefined) {
      subView = step.route.subView(merge(step.props, merge(step.match, {subView})));
    }

    if (step.route.view !== undefined) {
      return step.route.view(merge(step.props, merge(step.match, {subView})));
    }
  }
}

module.exports = createView;
