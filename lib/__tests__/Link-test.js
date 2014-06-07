/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var sinon = require('sinon');
var React = require('react');
var merge = require('react/lib/merge');
var cloneWithProps = require('react/lib/cloneWithProps');
var TestUtils = require('react/lib/ReactTestUtils');
var Link = require('../Link');
var route = require('../route');
var Routes = route.Routes;
var Route = route.Route;

describe('Link', function() {

  var App = React.createClass({

    childContextTypes: {
      routes: React.PropTypes.object,
      match: React.PropTypes.object,
      routing: React.PropTypes.object
    },

    getChildContext: function() {
      return {
        routes: this.props.routes,
        match: this.props.match,
        routing: this.props.routing
      };
    },

    render: function() {
      return cloneWithProps(this.props.children, {ref: 'link'});
    }
  });

  var users = (
    <Routes path="/users" name="users">
      <Route path=":user" name="user" />
      <Route path=":user/albums" name="user-albums" />
    </Routes>
  );

  var routes = (
    <Route>
      <Route path="/" name="main" />
      <Route path="/about" name="about" />
      {users}
    </Route>
  );

  var routing;

  function renderLink(link, match) {
    routing = {
      navigate: sinon.spy(),
      navigateTo: sinon.spy(),
      makeHref: sinon.stub().returns('URL')
    };
    match = match || {route: routes, trace: [{route: routes, match: {}}]};
    var app = App({routes, match, routing}, link);
    app = TestUtils.renderIntoDocument(app);
    return app.refs.link;
  }

  describe('markup generation', function() {

    function itGeneratesHrefTo(routeName, href, props, match) {
      it(`generate href ${href} by referring to ${routeName}`, function() {
        props = merge(props, {to: routeName});
        var link = renderLink(Link(props), match);
        assert.equal(link.getDOMNode().attributes.href.value, href);
      });
    }

    it('generates markup with href passed as a prop', function() {
      var link = renderLink(<Link href="/href">link</Link>);
      assert.equal(link.getDOMNode().attributes.href.value, '/href');
    });
  
    describe('generating href by referring to a route', function() {
      itGeneratesHrefTo('/main', 'URL');
      itGeneratesHrefTo('about', 'URL');
    });

  });

  describe('onClick behaviour', function() {

    it('navigates using routing (to prop)', function() {
      var link = renderLink(<Link to="/users/user" user="me" />);
      var e = {preventDefault: sinon.spy()};
      TestUtils.Simulate.click(link.getDOMNode(), e);
      sinon.assert.calledOnce(e.preventDefault);
      sinon.assert.calledOnce(routing.navigateTo);
      sinon.assert.calledWith(routing.navigateTo, '/users/user');
    });

    it('navigates using routing (to prop) and passes navigation params', function() {
      var link = renderLink(<Link to="/users/user" user="me" navigation={{foo: 'bar'}} />);
      var e = {preventDefault: sinon.spy()};
      TestUtils.Simulate.click(link.getDOMNode(), e);
      sinon.assert.calledOnce(e.preventDefault);
      sinon.assert.calledOnce(routing.navigateTo);
      sinon.assert.calledWith(routing.navigateTo,
        '/users/user',
        {navigation: {foo: 'bar'}, ref: 'link', to: '/users/user', user: 'me'},
        {foo: 'bar'});
    });

    it('navigates using routing (href prop)', function() {
      var link = renderLink(<Link href="/URL" />);
      var e = {preventDefault: sinon.spy()};
      TestUtils.Simulate.click(link.getDOMNode(), e);
      sinon.assert.calledOnce(e.preventDefault);
      sinon.assert.calledOnce(routing.navigate);
      sinon.assert.calledWith(routing.navigate, '/URL');
    });

    it('navigates using routing (href prop) and passes navigation params', function() {
      var link = renderLink(<Link href="/URL" navigation={{foo: 'bar'}} />);
      var e = {preventDefault: sinon.spy()};
      TestUtils.Simulate.click(link.getDOMNode(), e);
      sinon.assert.calledOnce(e.preventDefault);
      sinon.assert.calledOnce(routing.navigate);
      sinon.assert.calledWith(routing.navigate, '/URL', {foo: 'bar'});
    });

  });

});
