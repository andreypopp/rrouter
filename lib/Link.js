/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react');
var LinkMixin            = require('./LinkMixin');

var Link = React.createClass({
  mixins: [LinkMixin],

  render: function() {
    return this.transferPropsTo(
      <a href={this.href()} onClick={this.onClick}>
        {this.props.children}
      </a>
    );
  }
});

module.exports = Link;
