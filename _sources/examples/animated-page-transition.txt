Animated page transition example
================================

This example demonstrates how to implement animated transitions between routes.

Because RRouter isolates routing in one place, this example doesn't actually
demonstrates any unique RRouter feature. Instead animated transition is
implemented using `CSSTransitionGroup`_, an official addon for doing animations
with React.

.. _CSSTransitionGroup: http://facebook.github.io/react/docs/animation.html

Example
-------

.. raw:: html

    <div style="margin-bottom: 1em;" id="example-host"></div>
    <style>
      .App {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 200px;
      }
      .AboutPage, .MainPage {
        padding: 10px;
        width: 100%;
        height: 100%;
      }

      .AboutPage {
        background: #60d7a9;
      }

      .MainPage {
        background: #0ac2d2;
      }
      .moveUp-enter {
        position: absolute;

        -webkit-transition-duration: .3s;
        -moz-transition-duration: .3s;
        -ms-transition-duration: .3s;
        -o-transition-duration: .3s;
        transition-duration: .3s;
    
        -webkit-transition-property: -webkit-transform, opacity;
        -moz-transition-property: -moz-transform, opacity;
        -ms-transition-property: -ms-transform, opacity;
        -o-transition-property: -o-transform, opacity;
        transition-property: transform, opacity;
    
        -webkit-transition-timing-function: ease-out;
        -moz-transition-timing-function: ease-out;
        -ms-transition-timing-function: ease-out;
        -o-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
        
        -webkit-transform: translate3d(0,100%,0);
        -moz-transform: translate3d(0,100%,0);
        -ms-transform: translate3d(0,100%,0);
        -o-transform: translate3d(0,100%,0);
        transform: translate3d(0,100%,0);

        z-index: 10000;
      }

      .moveUp-enter.moveUp-enter-active {
        -webkit-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        -ms-transform: translate3d(0,0,0);
        -o-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
      }

      .moveUp-leave {
        position: absolute;

        -webkit-transition-duration: .3s;
        -moz-transition-duration: .3s;
        -ms-transition-duration: .3s;
        -o-transition-duration: .3s;
        transition-duration: .3s;
    
        -webkit-transition-property: -webkit-transform, opacity;
        -moz-transition-property: -moz-transform, opacity;
        -ms-transition-property: -ms-transform, opacity;
        -o-transition-property: -o-transform, opacity;
        transition-property: transform, opacity;
    
        -webkit-transition-timing-function: ease-out;
        -moz-transition-timing-function: ease-out;
        -ms-transition-timing-function: ease-out;
        -o-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
        
        -webkit-transform: translate3d(0,0,0);
        -moz-transform: translate3d(0,0,0);
        -ms-transform: translate3d(0,0,0);
        -o-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
        
        opacity: 1;
      }

      .moveUp-leave.moveUp-leave-active {
        -webkit-transform: translate3d(0,-15%,0);
        -moz-transform: translate3d(0,-15%,0);
        -ms-transform: translate3d(0,-15%,0);
        -o-transform: translate3d(0,-15%,0);
        transform: translate3d(0,-15%,0);
        
        opacity: 0.3;
      }
    </style>

Implementation
--------------

First we need some styles specific for the example::

  .App {
    overflow: hidden;
    width: 100%;
    height: 200px;
  }

  .AboutPage, .MainPage {
    padding: 10px;
    width: 100%;
    height: 100%;
  }

  .AboutPage {
    background: #60d7a9;
  }

  .MainPage {
    background: #0ac2d2;
  }

Now we describe our animated transition in CSS with CSS transitions (see
documentation on `CSSTransitionGroup_` for details)::

  .moveUp-enter {
    transition-duration: .3s;
    transition-property: transform, opacity;
    transition-timing-function: ease-out;
    transform: translate3d(0,100%,0);
    z-index: 10000;
  }

  .moveUp-enter.moveUp-enter-active {
    transform: translate3d(0,0,0);
  }

  .moveUp-leave {
    transition-duration: .3s;
    transition-property: transform, opacity;
    transition-timing-function: ease-out;
    transform: translate3d(0,0,0);
    opacity: 1;
  }

  .moveUp-leave.moveUp-leave-active {
    transform: translate3d(0,-15%,0);
    opacity: 0.3;
  }

The required requires:

.. jsx::

  var React = require('react')
  var CSSTransitionGroup = React.addons.CSSTransitionGroup
  var cloneWithProps = React.addons.cloneWithProps

  var RRouter = require('rrouter')
  var Routes = RRouter.Routes
  var Route = RRouter.Route
  var Link = RRouter.Link

and pages:

.. jsx::

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

Now the interesting part is that we don't render matched views directly into DOM
but instead wrap it into ``App`` component which is implemented using
``CSSTransitionGroup``:

.. jsx::

  var App = React.createClass({

    render: function() {
      return (
        <CSSTransitionGroup className="App" transitionName="moveUp" component={React.DOM.div}>
          {cloneWithProps(this.props.children, {key: this.props.path})}
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
    var app = <App path={match.path}>{view}</App>
    React.renderComponent(app, document.getElementById('example-host'))
  })
