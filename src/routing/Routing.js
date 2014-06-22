/**
 * @jsx React.DOM
 */
'use strict';

var React           = require('react');
var makeViewFactory = require('../makeViewFactoryForMatch');
var matchRoutes     = require('../matchRoutes');
var data            = require('../data');
var fetchViews      = require('../fetchViews');
var makeHref        = require('../makeHref');

function throwError(err) {
  throw err;
}

class Routing {

  constructor(routes, onRoute, onError) {
    this.routes = routes;
    this.onRoute = onRoute;
    this.onError = onError || throwError;
    this.onChange = this.onChange.bind(this);
    this.onBackButton = this.onBackButton.bind(this);
    this.path = null;
    this.match = null;
    this.started = false;
  }

  onChange(navigation) {
    navigation = navigation || {};
    var path = this.getPath();
    var query = this.getQuery();
    if (this.path !== path || this.query !== query) {
      this._route(path, query, navigation);
    }
  }

  onBackButton() {
    this.onChange({back: true});
  }

  update() {
    this._route(this.getPath(), this.getQuery());
  }

  _route(path, query, navigation) {
    this.path = path;
    this.query = query;
    this.match = matchRoutes(this.routes, path, query);

    var expectedMatch = this.match;

    var render = (match) => {
      if (this.match === expectedMatch) {
        var viewFactory = this.createViewFactory(match);
        this.onRoute(viewFactory, match, navigation);
      }
    };

    var promise = fetchViews(this.match);

    if (promise.isFulfilled()) {
      render(data.fetchProgressively(promise.value(), render, this.onError));
    } else {
      promise.then((match) => {
        render(data.fetchProgressively(match, render, this.onError));
      }, this.onError);
    }

    return this.match;
  }

  createViewFactory(match) {
    var context = {routing: this};
    var viewFactory = makeViewFactory(match);
    return function contextualViewFactory(props) {
      return React.withContext(context, () => viewFactory(props));
    }
  }

  navigate(path, navigation) {
    navigation = navigation || {};
    if (navigation.replace) {
      this.replacePath(path, navigation);
    } else {
      this.pushPath(path, navigation);
    }
    return this.onChange(navigation);
  }

  navigateTo(routeRef, props, navigation) {
    var path = this.makeHref(routeRef, props);
    this.navigate(path, navigation);
  }

  makeHref(name, params) {
    return makeHref(this.routes, name, this.match, params);
  }

  start() {
    if (!this.started) {
      this.doStart();
      this.onChange({initial: true});
      this.started = true;
    }
    return this;
  }

  stop() {
    if (this.started) {
      this.doStop();
      this.started = false;
    }
    return this;
  }

  static start(routes, onRoute, onError) {
    return new this(routes, onRoute, onError).start();
  }
}

module.exports = Routing;
