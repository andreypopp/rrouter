/**
 * @jsx React.DOM
 */
'use strict';

var merge         = require('react/lib/merge');
var emptyFunction = require('react/lib/emptyFunction');
var Promise       = require('bluebird');

/**
 * Make task
 *
 * @param {String} name
 * @param {Function} fetch
 * @returns {Function}
 */
function makeTask(name, fetch, deferred) {
  return function start(props, promises) {
    return fetch(props, promises).then(
      (result) => {
        deferred.resolve(result);

        var chunk = {};
        chunk[name] = result;
        return chunk;
      },
      (err) => {
        deferred.reject(err);
        throw err;
      }
    );
  };
}

var isPromisePropRe = /([a-zA-Z0-9]+)Promise$/;

/**
 * Fetch all promises defined in props
 *
 * @param {Object} props
 * @returns {Promise<Object>}
 */
function fetchProps(props) {
  var newProps = {};
  var promises = {};
  var tasks = [];

  for (var name in props) {
    var m = isPromisePropRe.exec(name);
    if (m) {
      var promiseName = m[1];
      var deferred = Promise.defer();
      tasks.push(makeTask(promiseName, props[name], deferred));
      promises[promiseName] = deferred.promise;
    } else {
      newProps[name] = props[name];
    }
  }

  return Promise
    .all(tasks.map((task) => task(newProps, promises)))
    .then((chunks) => chunks.reduce(merge, newProps))
    .finally(() => {
      for (var name in promises) {
        promises[name].catch(emptyFunction);
      }
    });
}

function fetchStep(step) {
  var props = merge(step.match, step.route.props);

  var promiseProps = fetchProps(props);
  var promiseView = step.route.viewPromise ?
    step.route.viewPromise(props) :
    Promise.resolve(step.route.view);

  return Promise.props({props: promiseProps, view: promiseView})
    .then((result) => {
      var route = merge(step.route, {view: result.view});
      return merge(step, {props: result.props, route})
    });
}

function fetchDataDependencies(match) {
  var promises = match.activeTrace.map(fetchStep);
  return Promise.all(promises)
    .then((activeTrace) => merge(match, {activeTrace}));
}

module.exports = fetchDataDependencies;
module.exports.fetchProps = fetchProps;
