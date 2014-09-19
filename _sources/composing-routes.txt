Composing routes
================

RRouter is designed for composability.

You can compose your application from smaller isolated pieces with its own data
dependencies and correct link generation.

A basic example would be to define user related app functionality into a
separate routing structure with its own views::

  var usersRoutes = (
    <Routes name="users" view={Users}>
      <Route name="user" path=":username" view={User} />
      <Route name="user-albums" path=":username/albums" view={UserAlbums} />
    </Routes>
  )

Then you can use ``usersRoutes`` as a part of your global application routes::

  var routes = (
    <Routes>
      <Route name="main" path="/">
      <Route path="/users">
        {usersRoutes}
      </Route>
      <Route name="about" path="/about">
    </Routes>
  )
