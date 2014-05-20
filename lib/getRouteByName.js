/**
 * @jsx React.DOM
 */
'use strict';

var invariant = require('react/lib/invariant');

function toQueueItem(route, parentName) {
  return {route, parentName};
}

function populateCache(routes) {
  var __cache = {};

  var queue = Array.isArray(routes) ?
    routes.slice(0).map((route) => toQueueItem(route)) :
    [toQueueItem(routes)];

  while (queue.length > 0) {
    var item = queue.shift();

    var name = item.parentName ? item.parentName.slice(0) : [];

    // check if we already have routes cache so we can merge it
    if (item.route.__cache !== undefined) {
      for (var subName in item.route.__cache) {
        __cache[name.concat(subName).join('/')] = item.route.__cache[subName];
      }
      continue;
    }

    if (item.route.name) {
      name.push(item.route.name);

      var joinedName = name.join('/');

      invariant(
        __cache[joinedName] === undefined,
        'route with the name "%s" defined twice', joinedName
      );

      __cache[joinedName] = item.route;
    }

    queue = queue.concat(
      item.route.children.map((child) => toQueueItem(child, name)));
  }

  Object.defaultProperty(routes, '__cache', {
    enumerable: false,
    value: __cache
  });

  return routes;
}

function getRouteByName(routes, name) {
  if (routes.__cache === undefined) {
    populateCache(routes);
  }
  return routes.__cache[name];
}

module.exports = getRouteByName;
