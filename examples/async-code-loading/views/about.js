/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react')
var RRouter = require('rrouter')
var Link = RRouter.Link

var About = React.createClass({

  render: function() {
    return (
      <div>
        <h1>About page</h1>
        <Link to="/main">Go to main</Link>
      </div>
    )
  }
})

module.exports = About
