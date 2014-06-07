Master-detail example
=====================

This example demonstrates how to use nested routes, ``Link`` component and data
dependencies to implement "master-detail" type of UI.

.. raw:: html

    <div style="margin-bottom: 1em;" id="example"></div>

Implementation
--------------

Data dependencies mechanism expects that promises are returned. We will use
bluebird_ library which provides ES6 compatible promises for browsers (and
Node.js):

.. jsx::

  var Promise = require('bluebird')
  var React = require('react')
  var RRouter = require('rrouter')

  var Routes = RRouter.Routes
  var Route = RRouter.Route
  var Link = RRouter.Link

Now we define ``Master`` view which renders a list of links to ``Detail`` view
for each item:

.. jsx::

  var Master = React.createClass({

    getDefaultProps: function() {
      return {detail: function() { }}
    },

    render: function() {
      if (!this.props.items) {
        return <div>Loading...</div>;
      }

      var items = this.props.items.map(function(id) {
        return (
          <li key={id}>
            <Link to="master/detail" id={id}>Show {id} item</Link>
          </li>
        )
      })
      var detail = this.props.detail
      return (
        <div>
          <ul>{items}</ul>
          <detail />
        </div>
      )
    }
  })

Note that instead of using ``<a>`` DOM component we use ``Link`` component which
can generate ``<a>`` with a correct ``href`` property for us.

Next we define ``Detail`` view which renders detailed information on a given
item:

.. jsx::

  var Detail = React.createClass({

    render: function() {
      if (!this.props.item) {
        return <div>Loading...</div>;
      } else {
        return <div>Detailed info for {this.props.item} item</div>
      }
    }
  })

Note that both ``Master`` and ``Detail`` views doesn't deal with fetching data.
They are just regular stateless React components.

Now we define ``getItems`` and ``getItem`` functions which fetch a list of items
and an item by its id correspondingly:

.. jsx::

  var loadedItems = null;
  var loadedItem = {};

  function getItems(props) {
    if (loadedItems !== null) {
      return Promise.resolve(loadedItems);
    }
    return new Promise(function(resolve) {
      setTimeout(function() {
        loadedItems = [1, 2, 3, 4, 5];
        resolve(loadedItems);
      }, 700)
    })
  }

  function getItem(props) {
    if (loadedItem[props.id]) {
      return Promise.resolve(loadedItem[props.id]);
    }
    return new Promise(function(resolve) {
      setTimeout(function() {
        loadedItem[props.id] = props.id;
        resolve(loadedItem[props.id]);
      }, 1500)
    })
  }

We used dummy implementations. In the real application these functions will hit
database or a remote API to fetch data.

Now we define a routing configuration with corresponding data dependencies:

.. jsx::

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
view into DOM:

.. jsx::

  RRouter.HashRouting.start(routes, function(view) {
    React.renderComponent(view, document.getElementById('example'))
  })

.. _bluebird: https://github.com/petkaantonov/bluebird
