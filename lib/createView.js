/**
 * @jsx React.DOM
 */
'use strict';

var invariant = require('react/lib/invariant');
var merge = require('react/lib/merge');

var isViewPropRe = /([a-zA-Z0-9]+)View$/;

function getViewProps(allProps) {
  var views = {};
  var props = {};

  for (var name in allProps) {
    var m = isViewPropRe.exec(name);
    if (m) {
      var prop = m[1];

      invariant(
        !allProps.hasOwnProperty(prop),
        'view property "' + name + '" would overwrite regular property "' + prop + '"'
      );

      views[prop] = allProps[name];
    } else {
      props[name] = allProps[name];
    }
  }

  return {views, props};
}

function makeViewFactory(viewClass, viewProps) {
  return function viewFactory(props) {
    props = props !== null && props !== undefined ?
      merge(viewProps, props) :
      viewProps;
    return viewClass(props);
  };
}

function collectSubViews(props, subViews) {
  var r = getViewProps(props);
  var views = {};

  for (var name in r.views) {
    views[name] = makeViewFactory(r.views[name], merge(r.props, subViews));
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

    views = merge(views, collectSubViews(step.props, views));

    if (step.route.view !== undefined) {
      var props = merge(step.props, views);
      return step.route.view(props);
    }
  }
}

module.exports = createView;
module.exports.getViewProps = getViewProps;
