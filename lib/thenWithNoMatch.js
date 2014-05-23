/**
 * @jsx React.DOM
 */
'use strict';

/**
 * A helper for chaining promises which threads the `noMatch` attribute.
 *
 * TODO: Think of the better way to do this.
 */
function thenWithNoMatch(promise, onResolve, onReject) {
  var nextPromise = promise.then(onResolve, onReject);
  nextPromise.noMatch = promise.noMatch;
  return nextPromise;
}

module.exports = thenWithNoMatch;
