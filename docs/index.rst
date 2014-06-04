RRouter
=======

RRouter is a declarative routing layer for React applications.

The main idea of RRouter is to isolate routing in an application in a single
place. That makes possible to compose your application from "pure" React
components.

The minimal React application which uses RRouter looks like::

  var React = require('react')
  var RRouter = require('rrouter')
  var Routes = RRouter.Routes
  var Route = RRouter.Route

  var MainPage = React.createClass({ ... })
  var AboutPage = React.createClass({ ... })

  var routes = (
    <Routes>
      <Route name="main" path="/" view={MainPage} />
      <Route name="about" path="/about" view={AboutPage} />
    </Routes>
  )

  RRouter.start(routes, function(view) {
    React.renderComponent(view, document.getElementById('app'))
  })

Features
--------

**Declarative routing configuration**. Application routes are configured in a
declarative way. Application can inspect configuration and attach additional
metadata to routes. Routing configuration can be nested, so that we can
naturally express interdependencies between routes in an application.

**Named routes and link generation**. Each route can have a ``name`` property
which is used to refer to a route inside a routing structure. RRouter also
provides a ``Link`` component which can generate a ``<a>`` element which points
to a specific route by simply referring to the route via ``to`` prop::

  <Link to="/user-profile" username="john">Profile</Link>

**Data dependencies**. Routes can specify which data should be fetched
asynchronously. It works even with nested routing configurations — RRouter will
collect all data dependencies and fetch them in parallel.

**Composability**. Applications can be composed from smaller isolated pieces
with their own routes. Those smaller pieces can be completely unaware of other
the environment including the prefix they are mounted under.

**Server-side rendering**. An application which uses RRouter can be rendered
entirely on server (using JavaScript runtime such as Node or V8). This works
even if routes require to fetch some data before rendering markup.

How is it different than react-router-component?
------------------------------------------------

RRouter can be seen as the next iteration of react-router-component_.

While react-router-component has a relatively nice and easy-to-use API for a set
of simple use cases it scales poorly for more complex ones. Also its
implementation pays a high price in terms of complexity.

The main strong and at the same time weak point of react-router-component is
that it configures routing through the ``render()`` method of a React component.
Thus the router itself is a part of a component hierarchy.

That may seems great because routing can be configured dynamically and based on
a current UI state. But at the same time it makes reasoning about routing more
difficult and so some use cases become unnecessary complex when implemented with
react-router-component.

Another issue when having router as a part of a component hierarchy is that it
requires the use of react-async_ for data fetching when rendering an application
on server. The use of react-async_ implies usage of node-fibers_ which is
usually considered as "magic" and scares people away.

RRouter takes more pragmatic approach by separating routing out of the React
component hierarchy. It operates on a routing structure which isn't couple to
React lifecycle. That way reasoning about routes in a application becomes a lot
more easier and data fetching can be implemented without "magic".

The interesting thing is that react-router-component API can be implemented on
top of RRouter with a couple of lines of code.

.. toctree::
   :maxdepth: 3
   :hidden:

   self
   usage
   routing-configuration
   navigation
   data-fetching
   composing-routes
   server-side-rendering
   examples/index
   related-work

.. _react-router-component: http://andreypopp.viewdocs.io/react-router-component
.. _react-async: http://andreypopp.viewdocs.io/react-async
.. _node-fibers: https://github.com/laverdet/node-fibers
