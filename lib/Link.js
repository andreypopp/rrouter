/**
 * @jsx React.DOM
 */
'use strict';

var React          = require('react');
var invariant      = require('react/lib/invariant');
var getRouteByName = require('./getRouteByName');

var Link = React.createClass({

  contextTypes: {
    routing: React.PropTypes.object,
    routes: React.PropTypes.object,
    route: React.PropTypes.object
  },

  onClick: function(e) {
    e.preventDefault();
    invariant(
      this.context.routing,
      'no routing found in context for Link component'
    );
    this.context.routing.navigate(this.href());
  },

  href(): function() {
    if (this.props.href) {
      return this.props.href;
    } else if (this.props.name) {

      var absolute = this.props.name[0] === '/';
      var name = absolute ? this.props.name.slice(1) : this.props.name;
      var routes = absolute ? this.context.routes : this.context.route;

      invariant(
        routes,
        'no routes found in context for Link component'
      );

      var route = getRouteByName(routes, this.props.name);

      invariant(
        route,
        'no route found for name "%s"', this.props.name
      );

      // TODO: handle optional and splat params
      return route.path.replace(
        /:[a-zA-Z0-9_]+/,
        (name) => this.props[name.slice(1)]
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
