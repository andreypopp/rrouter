/**
 * @jsx React.DOM
 */
'use strict';

var Routing = require('./Routing');

class HashRouting extends Routing {

  getPath() {
    return window.location.hash.slice(1) || '/';
  }

  pushPath(path) {
    window.location.hash = path;
  }

  replacePath(path) {
    var href = window.location.href.replace(/(javascript:|#).*$/, '');
    window.location.replace(href + '#' + path);
  }

  makeHref(name, params) {
    return '#' + super.makeHref(name, params);
  }

  doStart() {
    window.addEventListener('hashchange', this.onChange);
  }

  doStop() {
    window.removeEventListener('hashchange', this.onChange);
  }
}

module.exports = HashRouting;
