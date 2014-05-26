/**
 * @jsx React.DOM
 */
'use strict';

var merge   = require('react/lib/merge');
var Promise = require('bluebird');

/**
 * Make task
 *
 * @param {String} name
 * @param {Function} fetch
 * @returns {Function}
 */
function makeTask(name, fetch) {
  return function start(props) {
    return fetch(props).then((result) => {
      var chunk = {};
      chunk[name] = result;
      return chunk;
    });
  };
}

function lowerCaseFirstLetter(str) {
  return str[0].toLowerCase() + str.substring(1);
}

function depromisifyPropName(name) {
  return lowerCaseFirstLetter(name.replace(/^promise/, ''));
}

/**
 * Fetch all promises defined in props
 *
 * @param {Object} props
 * @returns {Promise<Object>}
 */
function fetchProps(props) {
  var newProps = {};
  var tasks = [];

  for (var name in props) {
    if (/promise[A-Z]+/.exec(name)) {
      tasks.push(makeTask(depromisifyPropName(name), props[name]));
    } else {
      newProps[name] = props[name];
    }
  }

  return Promise
    .all(tasks.map((task) => task(newProps)))
    .then((chunks) => chunks.reduce(merge, newProps));
}

function fetchStep(step) {
  // XXX: or vice versa?
  var props = merge(step.match, step.route.props);
  return fetchProps(props).then((props) => merge(step, {props}));
}

function fetchDataDependencies(match) {
  var promises = match.activeTrace.map(fetchStep);
  return Promise.all(promises)
    .then((activeTrace) => merge(match, {activeTrace}));
}

module.exports = fetchDataDependencies;
module.exports.fetchProps = fetchProps;
