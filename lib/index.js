/**
 * @jsx React.DOM
 */
'use strict';

var matchRoutes = require('./matchRoutes');
var createView  = require('./createView');
var Routing     = require('./routing/PathnameRouting');
var Link        = require('./Link');

/**
 * Route desriptor constructor
 *
 * @param {Object} props
 * @param {Object...} children
 * @returns {Route}
 */
function Route(props) {
  props = props || {};

  var path = props.path;
  delete props.path;

  var view = props.view;
  delete props.view;

  var name = props.name;
  delete props.name;

  var children = Array.prototype.slice.call(arguments, 1);

  return {path, name, view, props, children};
}

module.exports = {
  Route,
  matchRoutes,
  createView,
  Link,
  start: Routing.start.bind(Routing)
};
