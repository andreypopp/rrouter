RRouter: declarative router for React applications
==================================================

RRouter provides a declarative router for React applications.

Minimal usage example
---------------------

.. note::
  :name: CommonJS

  This usage example assumes you use CommonJS module system (with a tool like
  browserify or webpack). RRouter is also usable outside of CommonJS.

First, we need to bring ``React`` and ``RRouter`` into scope. We also alias
``RRouter.Route`` to ``Route`` so we can use it with JSX::

    var React = require('react')
    var RRouter = require('rrouter')
    var Route = RRouter.Route

Now we define routes using familiar JSX syntax::

    var routes = (
      <Route>
        <Route path="/" view={MainPage} />
        <Route path="/about" view={AboutPage} />
      </Route>
    )

The ``MainPage`` and ``AboutPage`` are regular React components which will be
rendered when browser hits ``/`` or ``/about`` paths correspondingly.

::

    function renderView(view) {
      React.renderComponent(view, document.body);
    }

    RRouter.start(routes, renderView);
