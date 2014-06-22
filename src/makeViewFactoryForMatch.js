/**
 * @jsx React.DOM
 */
'use strict';

var invariant    = require('./invariant');
var merge        = require('./merge');
var getStepProps = require('./getStepProps');

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
 * Make view factory for a match object
 *
 * @param {Match} match
 * @param {Object} props
 * @returns {ReactComponent}
 */
function makeViewFactoryForMatch(match) {
  var views = {};

  for (var i = match.activeTrace.length - 1; i >= 0; i--) {
    var step = match.activeTrace[i];
    var stepProps = getStepProps(step);

    views = merge(views, collectSubViews(stepProps, views));

    if (step.route.view !== undefined) {
      return makeViewFactory(step.route.view, merge(stepProps, views));
    }
  }
}

module.exports = makeViewFactoryForMatch;
module.exports.getViewProps = getViewProps;
