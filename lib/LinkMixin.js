/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react');
var invariant           = require('react/lib/invariant');
var RoutingContextMixin = require('./RoutingContextMixin');

var LinkMixin = {
  mixins: [RoutingContextMixin],

  propTypes: {
    to: React.PropTypes.string,
    href: React.PropTypes.string
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
