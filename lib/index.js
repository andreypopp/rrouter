/**
 * @jsx React.DOM
 */
'use strict';

var matchRoutes         = require('./matchRoutes');
var createView          = require('./createView');
var PathnameRouting     = require('./routing/PathnameRouting');
var HashRouting         = require('./routing/HashRouting');
var Link                = require('./Link');
var LinkMixin           = require('./LinkMixin');
var route               = require('./route');
var RoutingContextMixin = require('./RoutingContextMixin');

module.exports = {
  Routes: route.Routes,
  Route: route.Route,
  Link,
  LinkMixin,
  matchRoutes,
  createView,
  start: PathnameRouting.start.bind(PathnameRouting),
  PathnameRouting,
  HashRouting,
  RoutingContextMixin
};
