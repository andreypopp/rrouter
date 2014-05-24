Master-detail example
=====================

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
            var items = [1, 2, 3, 4, 5].map(function(id, index) {
              return React.DOM.li({key: index},
                Link({to: 'master/detail', id: id}, id))
            })
            return React.DOM.ul(null, items)
          }
        })

        var Detail = React.createClass({

          render: function() {
            return React.DOM.div(null, "Detail for ", this.props.item)
          }
        })

        var View = React.createClass({

          render: function() {
            return React.DOM.div(null,
              Master(),
              this.props.item && Detail( {item: this.props.item})
            )
          }
        })

        function getItem(props) {
          return new Promise(function(resolve) {
            resolve(props.id)
          })
        }

        var routes = Routes(null,
          Route({name: 'master', path: '/', view: View},
            Route({name: 'detail', path: ':id', promiseItem: getItem, view: View})
          )
        )

        RRouter.HashRouting.start(routes, function(view) {
          React.renderComponent(view, document.getElementById('example'))
        })
      }
    </script>

Some text
