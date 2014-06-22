/**
 * @jsx React.DOM
 */
'use strict';

var React     = require('react');
var invariant = require('./invariant');

var contextTypes = {
  routing: React.PropTypes.object
};

var RoutingContextMixin = {
  contextTypes: contextTypes,

  getRouting: function() {
    invariant(
      this.context.routing,
      'no routing found in context'
    );
    return this.context.routing;
  }
};

module.exports = RoutingContextMixin;
