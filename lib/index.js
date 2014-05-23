/**
 * @jsx React.DOM
 */
'use strict';

var matchRoutes     = require('./matchRoutes');
var createView      = require('./createView');
var PathnameRouting = require('./routing/PathnameRouting');
var HashRouting     = require('./routing/HashRouting');
var Link            = require('./Link');
var Route           = require('./Route');

module.exports = {
  Route,
  Link,
  matchRoutes,
  createView,
  start: PathnameRouting.start.bind(PathnameRouting),
  PathnameRouting,
  HashRouting
};
