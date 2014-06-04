/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var Promise = require('bluebird');
var fetchProps = require('../data').fetchProps;

function ita(name, testCase) {
  return it(name, function(done) {
    return testCase().then(function() { done(); }, done);
  });
}

describe('fetchProps', function() {

  ita('returns regular props as-is', function() {

    var data = {a: 1, b: 2, c: {d: 3}};

    return fetchProps(data).then((nextData) => {
      assert.deepEqual(nextData, data);
    });
  });

  ita('fetches *Promise props', function() {

    function fetchC(props) {
      assert.deepEqual(props, {a: 1, b: 2});
      return new Promise((resolve, reject) => {
        resolve('fetched!');
      });
    }

    var data = {a: 1, b: 2, cPromise: fetchC};

    return fetchProps(data).then((nextData) => {
      assert.deepEqual(nextData, {a: 1, b: 2, c: 'fetched!'});
    });
  });

  ita('fails if one of the async props fails', function() {

    function failC() {
      return new Promise((resolve, reject) => {
        reject(new Error('async'));
      });
    }

    var data = {a: 1, b: 2, cPromise: failC};

    return fetchProps(data).then(
      () => assert.ok(false, 'should not succeed'),
      (err) => assert.equal(err.message, 'async')
    );
  });

  ita('allows to sync on other *Promise props', function() {
    function getA(props) {
      return new Promise((resolve) => resolve(41));
    }

    function waitForAGetB(props, promises) {
      return promises.a.then((a) => a + 1);
    }

    var data = {aPromise: getA, bPromise: waitForAGetB};

    return fetchProps(data).then(
      (props) => assert.deepEqual(props, {a: 41, b: 42}),
      (err) => assert.ok(false)
    );

  });

});
