/**
 * @jsx React.DOM
 */
'use strict';

var Routing = require('./Routing');

class HashRouting extends Routing {

  getPath() {
    return this.getParsedPath().path;
  }

  getQuery() {
    return this.getParsedPath().query;
  }

  getParsedPath() {
    var path = window.location.hash.slice(1) || '/';
    var idx = path.indexOf('?');
    if (idx > -1) {
      return {path: path.substring(0, idx), query: path.substring(idx + 1)};
    } else {
      return {path, query: ''};
    }
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
