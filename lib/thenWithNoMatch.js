/**
 * @jsx React.DOM
 */
'use strict';

function thenWithNoMatch(promise, onResolve, onReject) {
  var nextPromise = promise.then(onResolve, onReject);
  nextPromise.noMatch = promise.noMatch;
  return nextPromise;
}

module.exports = thenWithNoMatch;
