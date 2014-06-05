/**
 * @jsx React.DOM
 */
'use strict';

var mergeInto = require('./mergeInto');

function getStepProps(step) {
  var props = {};
  mergeInto(props, step.match);
  mergeInto(props, step.route.props);
  mergeInto(props, step.props);
  return props;
}

module.exports = getStepProps;
