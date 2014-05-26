Routing configuration
=====================

Routing is configured using ``Route`` and ``Routes`` functions which produce
route descriptors::

    var RRouter = require('rrouter')

    var Route = RRouter.Route
    var Routes = RRouter.Routes

The difference between ``Routes`` and ``Route`` is that ``Routes`` should be
used at the top-level.

.. note::
  :class: inline

  see :doc:`composing-routes` for the detailed explanation of the differences
  between ``Routes`` and ``Route``

The basic routing configuration can look like::

    var routes = (
      <Routes>
        <Route path="/" view={Main} />
        <Route path="/about" view={About} />
      </Routes>
    )

Property ``path`` specifies the URL pattern for the route, ``view`` specifies
which component should be instantiated when the route's URL pattern matches the
current active path.

Parameters in URL pattern
-------------------------

URL pattern can have parameters which are matched against a single URL path
segment. This is similar to how Express_ works::

  <Routes>
    ...
    <Route path="/users/:username" view={User} />
    ...
  </Routes>

Route's view gets all parameters extracted from URL as props. Given the rout
configuration above, on URL ``/users/john`` route will match and ``User`` view
will be created with ``{username: "john"}`` as props.

.. _Express: http://expressjs.com/

Passing arbitrary props to a view
---------------------------------

You can pass arbitrary props into view by setting them on a corresponding
route::

  <Routes>
    ...
    <Route path="/users" view={Users} someProp="hello" />
    ...
  </Routes>

In the example above ``Users`` view will be created with ``{someProp: "hello"}``
as props.

The only props which won't be passed to a view are those which have a special
meaning to RRouter: ``name``, ``path`` and ``view``.

In the case of the nested routing configuration props will be collected along
the matched routes. More specific routes' props will override less specific.

Nested routes
-------------

Routing configuration can be defined in such a way that some of the routes are
nested inside others::

    var routes = (
      <Routes>
        <Route path="/" view={Main} />
        <Route path="/items" view={Items}>
          <Route path="/all" view={AllItem}>
          <Route path="/:id" view={Item}>
        </Route>
      </Routes>
    )

That can be used when some of the routes shares a part of the configuration.

Named routes
------------

Routes can have a ``name`` property which allows to reference a route inside the
routing configuration. For example, route references are used by ``Link``
component (see :doc:`navigation`) to generate ``href`` automatically for a
specified (by reference) route::

    var routes = (
      <Routes>
        <Route name="main" path="/" view={Main} />
        <Route name="items" path="/items" view={Items}>
          <Route name="all" path="/all" view={AllItem}>
          <Route name="item" path="/:id" view={Item}>
        </Route>
      </Routes>
    )

.. note::
  :class: inline

  Route references which starts with ``/`` character are called absolute route
  references. There exists also relative route references, see
  :doc:`composing-routes` for the detailed discussion on this.

Route references reflect the route hierarchy. Thus the reference for route with
``main`` name is ``/main``, for route with name ``item`` inside route with name
``items`` — ``/items/item`` and so on.

Promise-props
-------------

If an arbitrary prop set on route has ``Promise`` suffix then this prop is
considered a data dependency for a route. The value of such prop should be a
function which returns a promise::

  <Routes>
    ...
    <Route path="/users" view={Users} usersPromise={fetchUsers} />
    ...
  </Routes>

RRouter collects all data dependencies and evaluates them before creating the
matched view. That way route can get data fetched from a database or from a
remote API.

In the example above ``Users`` view will be called with ``{users: ...}`` as
props.

See :doc:`data-fetching` for a thoughtful explanation of data dependencies
concept.
