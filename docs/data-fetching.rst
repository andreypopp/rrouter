Data-fetching
=============

RRouter let you specify how to fetch data for for any route. To do that you need
to assign ``promise*`` props for a route.

A value of ``promise*`` prop should be a function which is called with available
props and returns a promise which resolves to some value which will be assigned
to the corresponding key of the ``props`` before rendering the view.

Basic usage
-----------

The basic example would be::

  function fetchUser(props) {
    return getUserByUsernameFromDatabase(props.username)
  }

  var routes = (
    <Routes>
      <Route promiseUser={fetchUser} path="/users/:username" view={User} />
    </Routes>
  )

.. note::
  :class: inline

  Note the conversion of prop's name from ``promiseUser`` to ``user``. This is
  the convention taken by RRouter.

When browser hits ``/users/john``, ``fetchUser`` will be called with props
extracted from URL (namely ``username``). It returns a promise, a resolved value
of which will be assigned to ``user`` prop of the final props passed to ``User``
view. The call to instantiate ``User`` component will look like::

  var view = <User username={usernameFromURL} user={userFromFetchUser} />

Usage with nested routes
------------------------

When you use nested routing configuration you can specify several ``promise*``
attributes on different levels::

  var routes = (
    <Routes promiseItems={fetchItemsList} path="/items" view={Items}>
      <Route promiseItem={fetchItem} path="/:itemId" view={Item} />
    </Routes>
  )

RRouter will collect all ``promise*`` props while traversing the routing
configuration to find a match and then will fetch them all in parallel.

On ``/items`` URL the ``Items`` view will be called with ``items`` prop. On
``/items/someid`` the ``Item`` view will be caled with ``items`` and ``item``
props.

This can be used to implement `"Master-Detail"`_ type of views. So that
``Items`` can provide listing of all items available and ``Item`` can be used to
provide the same listing with an additional detailed information on some
selected item form the listing.

.. _`"Master-Detail"`: examples/master-detail.html
