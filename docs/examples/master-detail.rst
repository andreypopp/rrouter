Master-detail example
=====================

This example demonstrates how to use nested routes, ``Link`` component and data
dependencies to implement "master-detail" type of UI.

.. raw:: html

    <div style="margin-bottom: 1em;" id="example"></div>
    <script>
      window.onload = function() {
        var Promise = require('bluebird')
        var React = require('react')
        var RRouter = require('rrouter')
        var Routes = RRouter.Routes
        var Route = RRouter.Route
        var Link = RRouter.Link

        var Master = React.createClass({

          render: function() {
            var items = this.props.items.map(function(id, index) {
              return React.DOM.li({key: index},
                Link({to: 'master/detail', id: id}, "Show ", id, " item"))
            })
            return React.DOM.div(null,
              React.DOM.ul(null, items),
              this.props.detailView
            )
          }
        })

        var Detail = React.createClass({

          render: function() {
            return React.DOM.div(null, "Detailed info for ", this.props.item, " item")
          }
        })

        function getItems(props) {
          return new Promise(function(resolve) {
            resolve([1, 2, 3, 4, 5])
          })
        }

        function getItem(props) {
          return new Promise(function(resolve) {
            resolve(props.id)
          })
        }

        var routes = Routes(null,
          Route({name: 'master', path: '/', itemsPromise: getItems, view: Master},
            Route({name: 'detail', path: ':id', itemPromise: getItem, detailView: Detail})
          )
        )

        RRouter.HashRouting.start(routes, function(view) {
          React.renderComponent(view, document.getElementById('example'))
        })
      }
    </script>

Implementation
--------------

Data dependencies mechanism expects that promises are returned. We will use
bluebird_ library which provides ES6 compatible promises for browsers (and
Node.js)::

  var Promise = require('bluebird')
  var React = require('react')
  var RRouter = require('rrouter')

  var Routes = RRouter.Routes
  var Route = RRouter.Route
  var Link = RRouter.Link

Now we define ``Master`` view which renders a list of links to ``Detail`` view
for each item::

  var Master = React.createClass({

    render: function() {
      var items = this.props.items.map(function(id) {
        return (
          <li key={id}>
            <Link to="master/detail" id={id}>Show {id} item</Link>
          </li>
      })
      return (
        <div>
          <ul>{items}</ul>
          {this.props.detailView}
        </div>
      )
    }
  })

Note that instead of using ``<a>`` DOM component we use ``Link`` component which
can generate ``<a>`` with a correct ``href`` property for us.

Next we define ``Detail`` view which renders detailed information on a given
item::

  var Detail = React.createClass({

    render: function() {
      return <div>Detailed info for {this.props.item} item</div>
    }
  })

Note that both ``Master`` and ``Detail`` views doesn't deal with fetching data.
They are just regular stateless React components.

Now we define ``getItems`` and ``getItem`` functions which fetch a list of items
and an item by its id correspondingly::

  function getItems(props) {
    return new Promise(function(resolve) {
      resolve([1, 2, 3, 4, 5])
    })
  }

  function getItem(props) {
    return new Promise(function(resolve) {
      resolve(props.id)
    })
  }

We used dummy implementations. In the real application these functions will hit
database or a remote API to fetch data.

Now we define a routing configuration with corresponding data dependencies::

  var routes = (
    <Routes>
      <Route name="master" path="/" itemsPromise={getItems} view={Master}>
        <Route name="detail" path=":id" itemPromise={getItem} detailView={Detail} />
      </Route>
    </Routes>
  )

Note that both routes hits the same ``View`` component, then it decides if it
should render ``Master`` or ``Master`` and ``Detail`` based on available props.

The final part is to start RRouter with our routing configuration and render
view into DOM::

  RRouter.HashRouting.start(routes, function(view) {
    React.renderComponent(view, document.getElementById('example'))
  })

.. _bluebird: https://github.com/petkaantonov/bluebird
