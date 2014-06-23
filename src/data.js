/**
 * @jsx React.DOM
 */
'use strict';

var Promise       = require('bluebird');
var merge         = require('./merge');
var emptyFunction = require('./emptyFunction');
var getStepProps  = require('./getStepProps');

/**
 * Make task
 *
 * @param {String} name
 * @param {Function} fetch
 * @returns {Function}
 */
function makeTask(fetch, deferred) {
  return function start(props, promises, match) {
    var promise = fetch(props, promises, match);

    if (promise.isFulfilled()) {
      deferred.resolve(promise.value());
      return promise;
    } else {
      return promise.then(
        (result) => {
          deferred.resolve(result);
          return result;
        },
        (err) => {
          deferred.reject(err);
          throw err;
        }
      );
    }
  };
}

var isPromisePropRe = /([a-zA-Z0-9]+)Promise$/;

/**
 * Fetch all promises defined in props
 *
 * @param {Object} props
 * @returns {Promise<Object>}
 */
function fetchProps(props, match) {
  var newProps = {};

  var deferreds = {};
  var promises = {};
  var tasks = {};

  var name;

  for (name in props) {
    var m = isPromisePropRe.exec(name);
    if (m) {
      var promiseName = m[1];
      var deferred = Promise.defer();
      tasks[promiseName] = makeTask(props[name], deferred);
      deferreds[promiseName] = deferred.promise;
    } else {
      newProps[name] = props[name];
    }
  }

  // not *Promise props, shortcircuit!
  if (Object.keys(deferreds).length === 0) {
    return Promise.resolve(props);
  }

  var isFulfilled = true;

  for (name in tasks) {
    var promise = tasks[name](newProps, deferreds, match);
    isFulfilled = isFulfilled && promise.isFulfilled();
    promises[name] = promise.isFulfilled() ? promise.value() : promise;
  }

  // every promise is resolved (probably from some DB cache?), shortcircuit!
  if (isFulfilled) {
    return Promise.resolve(merge(newProps, promises));
  }

  return Promise.props(promises)
    .then((props) => merge(newProps, props))
    .finally(() => {
      for (var name in deferreds) {
        deferreds[name].catch(emptyFunction);
      }
    });
}

function fetchStep(step, match) {
  var props = fetchProps(getStepProps(step), match);
  // step is resolved, shortcircuit!
  if (props.isFulfilled()) {
    return Promise.resolve(
      merge(step, {props: merge(step.props, props.value())}));
  } else {
    return Promise.props(props).then((props) =>
      merge(step, {props: merge(step.props, props)}));
  }
}

function fetchProgressively(match, onProgress, onError) {
  var activeTrace = match.activeTrace;
  var latch = activeTrace.length;

  activeTrace.forEach((step, idx) => {
    var promise = fetchStep(step, match);

    if (promise.isFulfilled()) {
      latch = latch - 1;
      activeTrace = activeTrace.slice(0);
      activeTrace[idx] = promise.value();
    } else {
      promise.then((step) => {
        activeTrace = activeTrace.slice(0);
        activeTrace[idx] = step;
        onProgress(merge(match, {activeTrace}));
      }).catch(onError);
    }
  });

  return merge(match, {activeTrace});
}

function fetch(match) {
  return Promise.all(match.activeTrace.map(function(step) {
    return fetchStep(step, match);
  })).then((activeTrace) => merge(match, {activeTrace}));
}

module.exports = {
  fetch,
  fetchProgressively,
  fetchProps
};
