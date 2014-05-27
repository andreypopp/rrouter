/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react')
var RRouter = require('rrouter')
var Routes = RRouter.Routes
var Route = RRouter.Route
var Link = RRouter.Link

var Main = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Main</h1>
      </div>
    )
  }
})

var Users = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Users</h1>
      </div>
    )
  }
})

var User = React.createClass({
  render: function() {
    return (
      <div>
        <h1>User {this.props.username}</h1>
      </div>
    )
  }
})

var App = React.createClass({
  render: function() {
    return (
      <div>
        <ul>
          <li><Link to="/main">Main</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/users/user" username="john">User John</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})

var routes = (
  <Routes>
    <Route name="main" path="/" view={Main}/>
    <Route name="users" path="/users" view={Users}>
      <Route name="user" path=":username" view={User}/>
    </Route>
  </Routes>
)

RRouter.HashRouting.start(routes, (view) => {
  React.renderComponent(<App>{view}</App>, document.body)
})
