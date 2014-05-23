/**
 * @jsx React.DOM
 */
'use strict';

var React     = require('react');
var invariant = require('react/lib/invariant');
var makeHref  = require('./makeHref');

var Link = React.createClass({

  propTypes: {
    to: React.PropTypes.string,
    href: React.PropTypes.string
  },

  contextTypes: {
    routing: React.PropTypes.object,
    routes: React.PropTypes.object,
    match: React.PropTypes.object
  },

  onClick: function(e) {
    e.preventDefault();
    invariant(
      this.context.routing,
      'no routing found in context for Link component'
    );
    this.context.routing.navigate(this.href());
  },

  href: function() {
    if (this.props.href) {
      return this.props.href;
    } else if (this.props.to) {
      invariant(
        this.context.routes,
        'no routes found in context for Link component'
      );
      invariant(
        this.context.match,
        'no match found in context for Link component'
      );
      return makeHref(
        this.context.routes,
        this.props.to,
        this.context.match,
        this.props
      );

   } else {
     // XXX: invariant?
     return undefined;
   }
  },

  render: function() {
    return (
      <a href={this.href()} onClick={this.onClick}>
        {this.props.children}
      </a>
    );
  }
});

module.exports = Link;
