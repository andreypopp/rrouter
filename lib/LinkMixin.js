/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react');
var invariant           = require('react/lib/invariant');
var qs                  = require('qs');
var RoutingContextMixin = require('./RoutingContextMixin');

var LinkMixin = {
  mixins: [RoutingContextMixin],

  propTypes: {
    to: React.PropTypes.string,
    href: React.PropTypes.string,
    query: React.PropTypes.object
  },

  href: function() {
    if (this.props.href) {
      return this.props.href;
    } else if (this.props.to) {
      var href = this.getRouting().makeHref(this.props.to, this.props);
      if (this.props.query) {
        href = href + '?' + qs.stringify(this.props.query);
      }
      return href;
    } else {
      invariant(
        false,
        'provide either "to" or "href" prop to Link component'
      );
    }
  }
};

module.exports = LinkMixin;
