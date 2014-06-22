/**
 * @jsx React.DOM
 */
'use strict';

var route               = require('./route');
var PathnameRouting     = require('./routing/PathnameRouting');
var HashRouting         = require('./routing/HashRouting');
var Link                = require('./Link');
var LinkMixin           = require('./LinkMixin');
var descriptors         = require('./descriptors');
var RoutingContextMixin = require('./RoutingContextMixin');

module.exports = {
  isRoutes: descriptors.isRoutes,
  Routes: descriptors.Routes,
  Route: descriptors.Route,
  Link,
  LinkMixin,
  start: PathnameRouting.start.bind(PathnameRouting),
  route,
  PathnameRouting,
  HashRouting,
  RoutingContextMixin
};
