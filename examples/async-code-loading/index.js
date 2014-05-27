/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react')
var merge = require('react/lib/merge')
var Promise = require('bluebird')

var RRouter = require('rrouter')
var Routes = RRouter.Routes
var Route = RRouter.Route

// a function which loads a view via webpack's bundle-loader
function loadViewModule(props) {
  var id = props.viewModule
  return new Promise((resolve) => require('bundle!./views/' + id)(resolve))
}

// a "syntax sugar" which shortcuts defining view code loading
function AsyncRoute(props) {
  props = merge(props, {
    viewPromise: loadViewModule,
    viewModule: props.view,
    view: undefined
  })
  return Route(props);
}

var routes = (
  <Routes>
    <AsyncRoute name="main" path="/" view="main" />
    <AsyncRoute name="about " path="/about" view="about" />
  </Routes>
)

RRouter.HashRouting.start(routes, (view) => {
  React.renderComponent(view, document.getElementById('app'))
})
