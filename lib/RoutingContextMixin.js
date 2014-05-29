/**
 * @jsx React.DOM
 */
'use strict';

var React     = require('react');
var invariant = require('react/lib/invariant');

var contextTypes = {
  routing: React.PropTypes.object,
  routes: React.PropTypes.object,
  match: React.PropTypes.object
};

var RoutingContextMixin = {
  contextTypes: contextTypes,

  navigate: function(path, navigation) {
    invariant(
      this.context.routing,
      'no routing found in context'
    );
    this.context.routing.navigate(path, navigation);
  },

  getMatch: function() {
    invariant(
      this.context.match,
      'no match found in context'
    );
    return this.context.match;
  },

  getRoutes: function() {
    invariant(
      this.context.routes,
      'no routes found in context'
    );
    return this.context.routes;
  },

  getRouting: function() {
    invariant(
      this.context.routing,
      'no routing found in context'
    );
    return this.context.routing;
  }
};

module.exports = RoutingContextMixin;
