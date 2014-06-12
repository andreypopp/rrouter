/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var Promise = require('bluebird');
var fetchProps = require('../data').fetchProps;
var fetchProgressively = require('../data').fetchProgressively;

function ita(name, testCase) {
  return it(name, function(done) {
    return testCase().then(function() { done(); }, done);
  });
}

function promise(value) {
  return function(props) {
    return new Promise((resolve) => setTimeout(() => resolve(value), 0));
  };
}

function resolvedPromise(value) {
  return function(props) {
    return Promise.resolve(value);
  };
}

function makeDoneLatch(done, counter) {
  return function(err) {
    if (err) {
      return done(err);
    } else if (counter <= 1) {
      done();
    } else {
      counter = counter - 1;
    }
  };
}

describe('fetchProgressively', function() {

  it('calls callback for each promise', function(done) {
    done = makeDoneLatch(done, 2);

    var match = {
      activeTrace: [
        {route: {props: {userPromise: promise('user')}}},
        {route: {props: {dataPromise: promise('data')}}}
      ]
    };

    var nMatch = fetchProgressively(match, function() {
      done();
    }, done);

    assert.deepEqual(nMatch.activeTrace[0].props, undefined);
    assert.deepEqual(nMatch.activeTrace[1].props, undefined);
  });

  it('does not call callback for already resolved promise', function(done) {
    done = makeDoneLatch(done, 1);

    var match = {
      activeTrace: [
        {route: {props: {userPromise: resolvedPromise('user')}}},
        {route: {props: {dataPromise: promise('data')}}}
      ]
    };

    var nMatch = fetchProgressively(match, function() {
      done();
    }, done);

    assert.deepEqual(nMatch.activeTrace[0].props, {user: 'user'});
    assert.deepEqual(nMatch.activeTrace[1].props, undefined);

  });

  it('does not call callback at all if all promises are resolved', function(done) {
    var match = {
      activeTrace: [
        {route: {props: {userPromise: resolvedPromise('user')}}},
        {route: {props: {dataPromise: resolvedPromise('data')}}}
      ]
    };

    var nMatch = fetchProgressively(match, function() {
      assert.ok(false);
    }, done);

    assert.deepEqual(nMatch.activeTrace[0].props, {user: 'user'});
    assert.deepEqual(nMatch.activeTrace[1].props, {data: 'data'});

    setTimeout(done, 10);
  });
});

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
