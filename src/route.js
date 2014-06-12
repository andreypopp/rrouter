/**
 * @jsx React.DOM
 */
'use strict';

var React       = require('react');
var Promise     = require('bluebird');
var matchRoutes = require('./matchRoutes');
var data        = require('./data');
var createView  = require('./createView');
var fetchViews  = require('./fetchViews');

function route(routes, path, query) {
  query = query || '';
  return new Promise((resolve, reject) => {
    var match = matchRoutes(routes, path, query);
    return fetchViews(match).then(data.fetch).then((match) => {
      return function execute(func) {
        React.withContext({match, routes}, () => {
          var view = createView(match);
          return func(view, match, {initial: true});
        });
      };
    }).then(resolve, reject);
  });
}

module.exports = route;
