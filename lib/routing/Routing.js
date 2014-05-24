/**
 * @jsx React.DOM
 */
'use strict';

var createView  = require('../createView');

function throwError(err) {
  throw err;
}

class Routing {

  constructor(routes, onRoute, onError) {
    this.routes = routes;
    this.onRoute = onRoute;
    this.onError = onError || throwError;
    this.onChange = this.onChange.bind(this);
    this.path = undefined;
    this.started = false;
  }

  onChange() {
    var path = this.getPath();
    if (this.path !== path) {
      this.path = path;
      return createView(this.routes, path, {routing: this})
        .then(this.onRoute, this.onError);
    }
  }

  navigate(path, navigation) {
    navigation = navigation || {};
    if (navigation.replace) {
      this.replacePath(path, navigation);
    } else {
      this.pushPath(path, navigation);
    }
    return this.onChange();
  }

  start() {
    if (!this.started) {
      this.doStart();
      this.onChange();
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
