/**
 * @jsx React.DOM
 */
'use strict';

var merge = require('react/lib/merge');

var isViewPropRe = /([a-zA-Z0-9]+)View$/;

function getViews(props) {
  var viewProps = {};

  for (var name in props) {
    var m = isViewPropRe.exec(name);
    if (m) {
      viewProps[name] = props[name];
    }
  }

  return viewProps;
}

function createViews(props, subViews) {
  var viewClasses = getViews(props);
  var views = {};

  for (var name in viewClasses) {
    views[name] = viewClasses[name](merge(props, subViews)); 
  }

  return views;
}

/**
 * Create a view for which matches for a path with the provided routes
 *
 * @param {Route} routes
 * @returns {Promise<ReactComponent>}
 */
function createView(match) {
  var views = {};

  for (var i = match.activeTrace.length - 1; i >= 0; i--) {
    var step = match.activeTrace[i];
    var stepViews = createViews(step.props, views);

    views = merge(views, stepViews);

    if (step.route.view !== undefined) {
      var props = merge(step.props, views);
      return step.route.view(props);
    }
  }
}

module.exports = createView;
module.exports.getViews = getViews;
