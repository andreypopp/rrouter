/**
 * @jsx React.DOM
 */
'use strict';

var merge   = require('react/lib/merge');
var Promise = require('bluebird');

function fetchViewsStep(step) {
  var props = merge(step.match, step.route.props);
  return step.route.viewPromise ?
    step.route.viewPromise(props).then((view) => merge(step, {view})) :
    step;
}

/**
 * Fetch views for match
 *
 * @param {Match} match
 * @returns {Match}
 */
function fetchViews(match) {
  var activeTrace = match.activeTrace.map(fetchViewsStep);

  return activeTrace.some(Promise.is) ?
    Promise.all(activeTrace).then((activeTrace) => merge(match, {activeTrace})) :
    Promise.resolve(merge(match, {activeTrace}));
}

module.exports = fetchViews;
