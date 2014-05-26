/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var Promise = require('bluebird');
var fetchDataDependencies = require('../fetchDataDependencies');
var fetchProps = fetchDataDependencies.fetchProps;

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

});
