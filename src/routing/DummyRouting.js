/**
 * @jsx React.DOM
 */
'use strict';

var Routing = require('./Routing');

class DummyRouting extends Routing {

  constructor(routes, match, path, query) {
    this.routes = routes;
    this.match = match;
    this.path = path;
    this.query = query;
  }

  getPath() {
    return this.path;
  }

  getQuery() {
    return this.query;
  }

  update() {
    throw new Error('not implemented');
  }

  pushPath() {
    throw new Error('not implemented');
  }

  replacePath() {
    throw new Error('not implemented');
  }

  doStart() {
    throw new Error('not implemented');
  }

  doStop() {
    throw new Error('not implemented');
  }
}

module.exports = DummyRouting;
