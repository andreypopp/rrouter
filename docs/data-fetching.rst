Data-fetching
=============

RRouter let you specify how to fetch data for for any route. To do that you need
to assign ``*Promise`` props for a route.

.. note::
   :class: inline

   We call ``*Promise`` props such props which have ``Promise`` suffix, like
   ``userProfilePromise`` and so on.

A value of ``*Promise`` prop should be a function which is called with available
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
      <Route userPromise={fetchUser} path="/users/:username" view={User} />
    </Routes>
  )

.. note::
  :class: inline

  Note the conversion of prop's name from ``userPromise=`` to ``user``. This is
  the convention taken by RRouter.

When browser hits ``/users/john``, ``fetchUser`` will be called with props
extracted from URL (namely ``username``). It returns a promise, a resolved value
of which will be assigned to ``user`` prop of the final props passed to ``User``
view. The call to instantiate ``User`` component will look like::

  var view = <User username={usernameFromURL} user={userFromFetchUser} />

Handling dependencies between data
----------------------------------

Sometimes you have a view which should receive a few props but these props are
interdependent. You can't fetch them in parallel because data from one prop is
needed to construct a query to fetch another prop.

RRouter let's you express those dependencies by combining promises as you do
usually via ``.then()`` method. When calling ``*Promise`` functions it passes
``promises`` object as second argument, each value of the object is a promise
for another ``*Promise`` prop::

  var routes = (
    <Routes>
      <Route
        userPromise={fetchUser}
        userAlbumsPromise={fetchUserAlbums}
        path="/users/:username"
        view={User}
        />
    </Routes>
  )

  function fetchUserAlbums(props, promises) {
    return promises.user.then(function(user) {
      return getAlbumsFromDatabase(user.username, user.someData)
    })
  }

.. attention:: 
  :class: inline

  It is possible to produce a deadlock. For example, if ``fetchA`` depends on
  ``fetchB`` and vice-versa then they will never return and will wait
  indefinitely.


In the example above ``fetchUserAlbums`` waits for ``fetchUser`` to complete and
only then uses some info from ``user`` prop value (just fetched via
``fetchUser``) to construct a query to database.

.. note::

  ``*Promise`` prop can depend on other ``*Promise`` prop only if they are
  defined for the same route. This restriction might be lifted in the future and
  enable interdependencies between data from different routes.

Relevant examples
-----------------

There is :doc:`examples/master-detail` which uses data-fetching.
