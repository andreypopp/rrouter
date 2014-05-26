Navigation
==========

RRouter provide several means to navigate between routes of an application. The
most preferred one is to ``<Link>`` component.

For the example code below we will use the following routing configuration::

  <Routes>
    <Route name="main" path="/" view={Main} />
    <Route name="about" path="/about" view={About} />
    <Route name="users" path="/users">
      <Route name="user" path=":username" view={User} />
    </Route>
  </Routes>

Using ``<Link>`` component
--------------------------

RRouter provides ``<Link>`` component which renders into ``<a>`` DOM component
but handles ``onClick`` by triggering a navigation instead of reloading the
page. First we need to bring ``<Link>`` component into scope::

  var RRouter = require('rrouter')
  var Link = RRouter.Link

Setting ``href`` property manually
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The simplest usage of ``<Link>`` component is analogues to ``<a>`` DOM
component, you just specify ``href`` property with desired URL::

  <Link href="/about">About page</Link>

This works well but not so convenient when you need to generate a link to a
route with parameters. Instead you can make ``<Link>>`` automatically generate
``href`` for you.

Automatically generating ``href`` using route references
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We can generate a ``href`` to a route named ``main`` with the following code::

  <Link to="/main">Main</Link>

.. note::
  :class: inline

  Route references respect hierarchy of routes. For example to reference a route
  with ``User`` view we use ``/users/user`` reference.

Note that instead of passing ``href`` we pass ``to`` property with a reference
to the route with ``Main`` view. The value of ``to`` property is called a route
reference. It's a way to reference a specific route inside routing
configuration.

The advantage of using ``<Link>`` component with route references is more
visible when we try to generate a link to a route with parameters::

  <Link to="/users/user" user="john">Profile</Link>

This will produce a link to ``/users/john``.

Using programmatic navigation
-----------------------------

It is possible to do a programmatic navigation using a routing instance returned
by ``RRouter.start()`` call:

.. note::
  :class: inline

  Programmatic in a sense of imperativeness as opposed to declarative style
  navigation using ``<Link>`` component.

::

  var routing = RRouter.start(routes, function(view) { ... })

The ``routing`` object has ``navigate(path)`` method which can be used to
transition to a different route::

  routing.navigate('/users/john')

Note that this requires you to keep a reference to a global ``routing`` object.
This isn't a bad thing per se but for some reason it can be inconvenient.

Another approach to programmatic navigation is to use ``RoutingContextMixin``::

  var MyComponent = React.createClass({
    mixins: [RoutingContextMixin],

    someMethod: function() {
      this.navigate('/users/john')
    }

  })

This mixin makes ``navigate(path)`` method available to a component.
