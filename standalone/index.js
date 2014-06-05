;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react', 'bluebird'], factory);
  } else {
    root.RRouter = factory(root.React, root.Promise);
  }
})(window, function(React, Promise) {
  return require('./lib/');
});
