/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var matchRoutes = require('../matchRoutes');

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
      return matchRoutes(this.routes, path)
        .then((match) => {

          if (!match.route || !match.route.view) {
            // XXX:
            return;
          }

          var context = {
            routing: this,
            match: match,
            routes: this.routes
          };
          return React.withContext(context, () => {
            var view = match.route.view(match.props);
            this.onRoute(view, match);
          });
        }, this.onError);
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
