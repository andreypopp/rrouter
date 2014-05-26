# rrouter

RRouter is a declarative routing layer for React applications.

The usage is as simple as:

    var React = require('react')
    var RRouter = require('rrouter')
    var Route = RRouter.Route

    var routes = (
      <Route>
        <Route path="/" view={MainPage} />
        <Route path="/about" view={AboutPage} />
      </Route>
    )

    RRouter.start(routes, function(view) {
      React.renderComponent(view, document.body)
    })

See [documentation][] for details.

[documentation]: http://andreypopp.github.io/rrouter/
