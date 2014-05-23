# rrouter

RRouter provides a declarative router for React applications.

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
