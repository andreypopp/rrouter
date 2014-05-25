Animated page transition example
================================

.. raw:: html

    <div style="margin-bottom: 1em;" id="example"></div>
    <style>
      .AboutPage, .MainPage {
        padding: 10px;
      }

      .AboutPage {
        background: #60d7a9;
      }

      .MainPage {
        background: #0ac2d2;
      }
      .moveUp-enter {
        transition-duration: .3s;
        transition-property: -webkit-transform, opacity;
        transition-timing-function: ease-out;
        -webkit-transform: translate3d(0,100%,0);
        z-index: 10000;
      }

      .moveUp-enter.moveUp-enter-active {
        -webkit-transform: translate3d(0,0,0);
      }

      .moveUp-leave {
        transition-duration: .3s;
        transition-property: -webkit-transform, opacity;
        transition-timing-function: ease-out;
        -webkit-transform: translate3d(0,0,0);
        opacity: 1;
      }

      .moveUp-leave.moveUp-leave-active {
        -webkit-transform: translate3d(0,-15%,0);
        opacity: 0.3;
      }
    </style>
    <script>
      window.onload = function() {
        var React = require('react')
        var CSSTransitionGroup = React.addons.CSSTransitionGroup
        var cloneWithProps = React.addons.cloneWithProps
        var RRouter = require('rrouter')
        var Routes = RRouter.Routes
        var Route = RRouter.Route
        var Link = RRouter.Link

        var MainPage = React.createClass({

          render: function() {
            return React.DOM.div({className: 'MainPage'},
              React.DOM.h5(null, 'Main page'),
              Link({to: 'about'}, 'Go to about page')
            )
          }
        })

        var AboutPage = React.createClass({

          render: function() {
            return React.DOM.div({className: 'AboutPage'},
              React.DOM.h5(null, 'About page'),
              Link({to: 'main'}, 'Go to main page')
            )
          }
        })

        var App = React.createClass({

          render: function() {
            return CSSTransitionGroup({
                transitionName: 'moveUp',
                component: React.DOM.div
              },
              cloneWithProps(this.props.children, {key: this.props.path})
            )
          }
        })

        var routes = Routes(null,
          Route({name: 'main', path: '/', view: MainPage}),
          Route({name: 'about', path: '/about', view: AboutPage})
        )

        RRouter.HashRouting.start(routes, function(view, match) {
          var app = App({path: match.path}, view)
          React.renderComponent(app, document.getElementById('example'))
        })
      }
    </script>

Implementation
--------------

Styles::

  .AboutPage, .MainPage {
    padding: 10px;
  }

  .AboutPage {
    background: #60d7a9;
  }

  .MainPage {
    background: #0ac2d2;
  }
  .moveUp-enter {
    transition-duration: .3s;
    transition-property: -webkit-transform, opacity;
    transition-timing-function: ease-out;
    -webkit-transform: translate3d(0,100%,0);
    z-index: 10000;
  }

  .moveUp-enter.moveUp-enter-active {
    -webkit-transform: translate3d(0,0,0);
  }

  .moveUp-leave {
    transition-duration: .3s;
    transition-property: -webkit-transform, opacity;
    transition-timing-function: ease-out;
    -webkit-transform: translate3d(0,0,0);
    opacity: 1;
  }

  .moveUp-leave.moveUp-leave-active {
    -webkit-transform: translate3d(0,-15%,0);
    opacity: 0.3;
  }

Code::

  var React = require('react')
  var CSSTransitionGroup = React.addons.CSSTransitionGroup
  var cloneWithProps = React.addons.cloneWithProps
  var RRouter = require('rrouter')
  var Routes = RRouter.Routes
  var Route = RRouter.Route
  var Link = RRouter.Link

  var MainPage = React.createClass({

    render: function() {
      return (
        <div className="MainPage">
          <h5>Main Page</h5>
          <Link to="about">Go to about page</Link>
        </div>
      )
    }
  })

  var AboutPage = React.createClass({

    render: function() {
      return (
        <div className="AboutPage">
          <h5>About Page</h5>
          <Link to="main">Go to main page</Link>
        </div>
      )
    }
  })

  var App = React.createClass({

    render: function() {
      return (
        <CSSTransitionGroup transitionName="moveUp" component={React.DOM.div}>
          {cloneWithProps(this.props.children, {key: Math.random()})}
        </CSSTransitionGroup>
      )
    }
  })

  var routes = (
    <Routes>
      <Route name="main" path="/" view={MainPage} />
      <Route name="about" path="/about" view={AboutPage} />
    </Routes>
  )

  RRouter.HashRouting.start(routes, function(view, match) {
    var app = <App>{view}</App>
    React.renderComponent(app, document.getElementById('example'))
  })
