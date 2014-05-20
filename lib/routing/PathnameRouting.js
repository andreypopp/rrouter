/**
 * @jsx React.DOM
 */
'use strict';

var Routing = require('./Routing');

class PathnameRouting extends Routing {

  getPath() {
    return window.location.pathname;
  }

  pushPath(path) {
    window.history.pushState({}, '', path);
  }

  replacePath(path) {
    window.history.replaceState({}, '', path);
  }

  doStart() {
    window.addEventListener('popstate', this.onChange);
  }

  doStop() {
    window.removeEventListener('popstate', this.onChange);
  }
}

module.exports = PathnameRouting;
