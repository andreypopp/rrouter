Getting started
===============

With CommonJS
-------------

The recommended way to use RRouter is via a CommonJS package which is
distributed on npm_. To install the RRouter you need to have an ``npm`` command
line tool installed (comes with a Node.js distribution)::

  % npm install rrouter react

This command will install both RRouter and React from npm.

Now create an ``index.js`` file which will serve as an entry point to your React
application.

.. note::
  :class: inline

  We will assume that your entire application lives in a single file
  for the sake of simplicity. When your application grows CommonJS module system
  makes it easy to factor your application in a set of separate modules.

First, we need to bring ``React`` and ``RRouter`` into scope::

    var React = require('react')
    var RRouter = require('rrouter')
    var Routes = RRouter.Routes
    var Route = RRouter.Route

Now we are going to define routes for two URLs, ``/`` and ``about``. We need to
define React component first which will serve as views for those URLs::

    var MainPage = React.createClass({
      render: function() {
        return <div>Main page</div>
      }
    })

    var AboutPage = React.createClass({
      render: function() {
        return <div>About</div>
      }
    })

Now we define routes using familiar JSX syntax::

    var routes = (
      <Routes>
        <Route path="/" view={MainPage} />
        <Route path="/about" view={AboutPage} />
      </Routes>
    )

The ``MainPage`` and ``AboutPage`` will be rendered when browser hits ``/`` or
``/about`` paths correspondingly. To start routing we need to initialize RRouter
with routes and a function which would handle rendering a currently active view
into DOM::

    RRouter.start(routes, function(view) {
      React.renderComponent(view, document.body);
    })

Now we need to create an ``index.html`` file which would serve as a container
for our application::

    <!doctype html>
    <body>
      <script src="/bundle.js"></script>
    </body>

The final part is to produce a ``bundle.js`` file which would include code for
our application in ``index.js`` along with React and RRouter libraries. We will
use browserify_ bundler for that.

.. note::
  :class: inline

  Another option is to use webpack_ bundler which is more powerful but is more
  complex for initial configuration. It also supports CommonJS so you can switch
  from browserify to webpack at any time.

Install browserify from npm and execute it on ``index.js``::

    % npm install -g browserify
    % browserify index.js > bundle.js

Now you can serve ``index.html`` via your favourite web server (Apache on nginx)
and see the app rendering the correct view both for ``/`` and ``/about`` URLs.

.. _npm: http://npmjs.org
.. _browserify: http://browserify.org
.. _webpack: http://webpack.github.io

With AMD
--------

.. note::

  Please send a pull-request with documentation on how to use RRouter with an
  AMD loader.

By including RRouter with <script> element
------------------------------------------

.. note::

  Please send a pull-request with documentation on how to use RRouter by
  including it as a ``<script>`` element.

