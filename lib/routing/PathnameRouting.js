/**
 * @jsx React.DOM
 */
'use strict';

var Routing = require('./Routing');

class PathnameRouting extends Routing {

  getPath() {
    return window.location.pathname;
  }

  getQuery() {
    return window.location.search.substr(1);
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
