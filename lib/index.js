/**
 * @jsx React.DOM
 */
'use strict';

var matchRoutes = require('./matchRoutes');
var createView  = require('./createView');
var Routing     = require('./routing/PathnameRouting');
var Link        = require('./Link');
var Route       = require('./Route');

module.exports = {
  Route,
  matchRoutes,
  createView,
  Link,
  start: Routing.start.bind(Routing)
};
