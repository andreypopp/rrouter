/**
 * @jsx React.DOM
 */
'use strict';

var Promise       = require('bluebird');
var matchRoutes   = require('./matchRoutes');
var data          = require('./data');
var fetchViews    = require('./fetchViews');
var DummyRouting  = require('./routing/DummyRouting');

function route(routes, path, query) {
  query = query || '';
  return new Promise((resolve, reject) => {
    var match = matchRoutes(routes, path, query);
    return fetchViews(match).then(data.fetch).then((match) => {
      var routing = new DummyRouting(routes, match, path, query);
      var viewFactory = routing.createViewFactory(match);
      viewFactory.match = match;
      return viewFactory;
    }).then(resolve, reject);
  });
}

module.exports = route;
