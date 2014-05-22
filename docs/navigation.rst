Navigation
==========

RRouter provides ``Link`` component which renders into ``<a>`` DOM component but
handles ``onClick`` by triggering an navigation. It also can generate ``href``
by route name.

First we need to bring ``Link`` component into scope::

  var Link = require('rrouter').Link

Now consider the following routing structure::

  <Route>
    <Route name="main" path="/" view={Main} />
    <Route name="about" path="/about" view={About} />
    <Route name="user" path="/users/:username" view={User} />
  </Route>

Generating link to a named route
--------------------------------

We can generate a link to a route named ``main`` with the following ``Link``
component::

  <Link to="/main">Main</Link>

This will be rendered into ``<a href="/">Main</a>``.
