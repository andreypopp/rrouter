/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react');
var invariant           = require('./invariant');
var RoutingContextMixin = require('./RoutingContextMixin');

var LinkMixin = {
  mixins: [RoutingContextMixin],

  propTypes: {
    to: React.PropTypes.string,
    href: React.PropTypes.string,
    query: React.PropTypes.object
  },

  activate: function() {
    var routing = this.getRouting();
    if (this.props.href) {
      routing.navigate(this.props.href, this.props.navigation);
    } else if (this.props.to) {
      routing.navigateTo(this.props.to, this.props, this.props.navigation);
    } else {
      invariant(
        false,
        'provide either "to" or "href" prop to Link component'
      );
    }
  },

  href: function() {
    if (this.props.href) {
      return this.props.href;
    } else if (this.props.to) {
      return this.getRouting().makeHref(this.props.to, this.props);
    } else {
      invariant(
        false,
        'provide either "to" or "href" prop to Link component'
      );
    }
  }
};

module.exports = LinkMixin;
