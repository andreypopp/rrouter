/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react')
var RRouter = require('rrouter')
var Link = RRouter.Link

var Main = React.createClass({

  render: function() {
    return (
      <div>
        <h1>Main page</h1>
        <Link href="/about">Go to about</Link>
      </div>
    )
  }
})

module.exports = Main
