/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var React = require('react');
var merge = require('react/lib/merge');
var cloneWithProps = require('react/lib/cloneWithProps');
var TestUtils = require('react/lib/ReactTestUtils');
var Link = require('../Link');
var Route = require('../index').Route;

describe('Link', function() {

  var App = React.createClass({

    childContextTypes: {
      routes: React.PropTypes.object,
      route: React.PropTypes.object
    },

    getChildContext: function() {
      return {
        routes: this.props.routes,
        route: this.props.route
      };
    },

    render: function() {
      return cloneWithProps(this.props.children, {ref: 'link'});
    }
  });

  var users = (
    <Route path="/users" name="users">
      <Route path=":user" name="user" />
      <Route path=":user/albums" name="user-albums" />
    </Route>
  );

  var routes = (
    <Route>
      <Route path="/" name="main" />
      <Route path="/about" name="about" />
      {users}
    </Route>
  );

  function renderLink(link, route) {
    var app = App({routes, route: routes || route}, link);
    app = TestUtils.renderIntoDocument(app);
    return app.refs.link;
  }

  describe('markup generation', function() {

    function itGeneratesHrefTo(routeName, href, props, route) {
      it(`generate href ${href} by referring to ${routeName}`, function() {
        props = merge(props, {to: routeName});
        var link = renderLink(Link(props), route);
        assert.equal(link.getDOMNode().attributes.href.value, href);
      });
    }

    it('generates markup with href passed as a prop', function() {
      var link = renderLink(<Link href="/href">link</Link>);
      assert.equal(link.getDOMNode().attributes.href.value, '/href');
    });

    describe('generating href by referring to an absolute route name', function() {
      itGeneratesHrefTo('/main', '/');
      itGeneratesHrefTo('/about', '/about');
      itGeneratesHrefTo('/users', '/users');
      itGeneratesHrefTo('/users/user', '/users/me', {user: 'me'});
      itGeneratesHrefTo('/users/user-albums', '/users/me/albums', {user: 'me'});
    });

    describe('generating href by referring to a relative route name', function() {
      itGeneratesHrefTo('main', '/', {}, routes);
      itGeneratesHrefTo('about', '/about', {}, routes);
      itGeneratesHrefTo('users', '/users', {}, routes);
      itGeneratesHrefTo('user', '/users/me', {user: 'me'}, users);
      itGeneratesHrefTo('user-albums', '/users/me/albums', {user: 'me'}, users);
    });

  });

  describe('onClick behaviour', function() {

  });

});
