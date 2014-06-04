/**
 * @jsx React.DOM
 */
'use strict';

var assert = require('assert');
var matchRoutes = require('../matchRoutes');
var Routes = require('../index').Routes;
var Route = require('../index').Route;

function assertSameTrace(a, b) {
  assert.equal(a.length, b.length, 'traces of different length');
  for (var i = 0; i < a.length; i++) {
    assertSameKeys(a[i], b[i]);
    assert.deepEqual(a[i].route, b[i].route);
    assert.deepEqual(a[i].match, b[i].match);
    assert.deepEqual(a[i].props, b[i].props);
  }
}

function assertSameKeys(a, b) {
  assert.deepEqual(
    Object.keys(a),
    Object.keys(b)
  );
}

function itMatches(routes, path, expectedMatch, query) {
  it(`matches ${path}`, function() {
    var match = matchRoutes(routes, path, query);
    assertSameKeys(match, expectedMatch);
    assert.deepEqual(
      match.path,
      expectedMatch.path
    );
    assert.deepEqual(
      match.route,
      expectedMatch.route
    );
    assertSameTrace(match.trace, expectedMatch.trace);
    assertSameTrace(match.activeTrace, expectedMatch.activeTrace);
  });
}

describe('matchRoutes', function() {

  describe('matching flat routing structures', function() {
  
    var routes = (
      <Route>
        <Route path="/" view="main" />
        <Route path="/users" view="users" />
        <Route path="/users/:user" view="user" />
        <Route path="/users/:user/albums" view="user-albums" />
        <Route path="/users/:user/*" view="user-everything" />
        <Route path="/items/:item/cat/:cat" view="item-cat" />
      </Route>
    );
  
    itMatches(routes, '/', {
      path: '/',
      route: routes.children[0],
      trace: [
        {route: routes, match: {}, props: {query: {}}},
        {route: routes.children[0], match: {}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[0], match: {}, props: {query: {}}}
      ]
    });
  
    itMatches(routes, '/users', {
      path: '/users',
      route: routes.children[1],
      trace: [
        {route: routes, match: {_: ['/users/']}, props: {query: {}}},
        {route: routes.children[1], match: {}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[1], match: {}, props: {query: {}}}
      ]
    });
  
    itMatches(routes, '/users/me', {
      path: '/users/me',
      route: routes.children[2],
      trace: [
        {route: routes, match: {_: ['/users/me/']}, props: {query: {}}},
        {route: routes.children[2], match: {user: 'me'}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[2], match: {user: 'me'}, props: {query: {}}}
      ]
    });
  
    itMatches(routes, '/users/me/albums', {
      path: '/users/me/albums',
      route: routes.children[3],
      trace: [
        {route: routes, match: {_: ['/users/me/albums/']}, props: {query: {}}},
        {route: routes.children[3], match: {user: 'me'}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[3], match: {user: 'me'}, props: {query: {}}}
      ]
    });
  
    itMatches(routes, '/users/me/songs', {
      path: '/users/me/songs',
      route: routes.children[4],
      trace: [
        {route: routes, match: {_: ['/users/me/songs/']}, props: {query: {}}},
        {route: routes.children[4], match: {user: 'me', _: ['songs']}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[4], match: {user: 'me', _: ['songs']}, props: {query: {}}}
      ]
    });

    itMatches(routes, '/items/itemid/cat/catid', {
      path: '/items/itemid/cat/catid',
      route: routes.children[5],
      trace: [
        {route: routes, match: {_: ['/items/itemid/cat/catid/']}, props: {query: {}}},
        {route: routes.children[5], match: {item: 'itemid', cat: 'catid'}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[5], match: {item: 'itemid', cat: 'catid'}, props: {query: {}}}
      ]
    });
  });
  
  describe('matching nested routing structures', function() {
  
    var routes = (
      <Route>
        <Route path="/" view="main" />
        <Route path="/users" view="users">
          <Route path=":user" view="user">
            <Route path="albums" view="user-albums" />
            <Route path="*" view="user-everything" />
          </Route>
        </Route>
        <Route path="/items">
          <Route path=":item">
            <Route path="cat/:cat" view="item-cat" />
          </Route>
        </Route>
      </Route>
    );

    itMatches(routes, '/', {
      path: '/',
      route: routes.children[0],
      trace: [
        {route: routes, match: {}, props: {query: {}}},
        {route: routes.children[0], match: {}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[0], match: {}, props: {query: {}}}
      ]
    });

    itMatches(routes, '/users', {
      path: '/users',
      route: routes.children[1],
      trace: [
        {route: routes, match: {_: ['/users/']}, props: {query: {}}},
        {route: routes.children[1], match: {}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[1], match: {}, props: {query: {}}}
      ]
    });

    itMatches(routes, '/users', {
      path: '/users',
      route: routes.children[1],
      trace: [
        {route: routes, match: {_: ['/users/']}, props: {query: {one: 'two', three: 'four'}}},
        {route: routes.children[1], match: {}, props: {query: {one: 'two', three: 'four'}}}
      ],
      activeTrace: [
        {route: routes.children[1], match: {}, props: {query: {one: 'two', three: 'four'}}}
      ]
    }, 'one=two&three=four');

    itMatches(routes, '/users/me', {
      path: '/users/me',
      route: routes.children[1].children[0],
      trace: [
        {route: routes, match: {_: ['/users/me/']}, props: {query: {}}},
        {route: routes.children[1], match: {_: ['me/']}, props: {query: {}}},
        {route: routes.children[1].children[0], match: {user: 'me'}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[1].children[0], match: {user: 'me'}, props: {query: {}}}
      ]
    });

    itMatches(routes, '/users/me/albums', {
      path: '/users/me/albums',
      route: routes.children[1].children[0].children[0],
      trace: [
        {route: routes, match: {_: ['/users/me/albums/']}, props: {query: {}}},
        {route: routes.children[1], match: {_: ['me/albums/']}, props: {query: {}}},
        {route: routes.children[1].children[0], match: {user: 'me', _: ['albums/']}, props: {query: {}}},
        {route: routes.children[1].children[0].children[0], match: {}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[1].children[0].children[0], match: {}, props: {query: {}}}
      ]
    });

    itMatches(routes, '/users/me/songs', {
      path: '/users/me/songs',
      route: routes.children[1].children[0].children[1],
      trace: [
        {route: routes, match: {_: ['/users/me/songs/']}, props: {query: {}}},
        {route: routes.children[1], match: {_: ['me/songs/']}, props: {query: {}}},
        {route: routes.children[1].children[0], match: {user: 'me', _: ['songs/']}, props: {query: {}}},
        {route: routes.children[1].children[0].children[1], match: {_: ['songs']}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[1].children[0].children[1], match: {_: ['songs']}, props: {query: {}}}
      ]
    });

    itMatches(routes, '/items/itemid/cat/catid', {
      path: '/items/itemid/cat/catid',
      route: routes.children[2].children[0].children[0],
      trace: [
        {route: routes, match: {_: ['/items/itemid/cat/catid/']}, props: {query: {}}},
        {route: routes.children[2], match: {_: ['itemid/cat/catid/']}, props: {query: {}}},
        {route: routes.children[2].children[0], match: {item: 'itemid', _: ['cat/catid/']}, props: {query: {}}},
        {route: routes.children[2].children[0].children[0], match: {cat: 'catid'}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[2].children[0].children[0], match: {cat: 'catid'}, props: {query: {}}}
      ]
    });
  });
  
  describe('matching decomposed nested routing structures', function() {
  
    var usersRoutes = (
      <Routes path="/" view="users">
        <Route path=":user" view="user">
          <Route path="albums" view="user-albums" />
          <Route path="*" view="user-everything" />
        </Route>
      </Routes>
    );
  
    var routes = (
      <Routes>
        <Route path="/" view="main" />
        <Route path="/users">
          {usersRoutes}
        </Route>
      </Routes>
    );
  
    itMatches(routes, '/', {
      path: '/',
      route: routes.children[0],
      trace: [
        {route: routes, match: {}, props: {query: {}}},
        {route: routes.children[0], match: {}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[0], match: {}, props: {query: {}}}
      ]
    });

    itMatches(routes, '/users', {
      path: '/users',
      route: routes.children[1].children[0],
      trace: [
        {route: routes, match: {_: ['/users/']}, props: {query: {}}},
        {route: routes.children[1], match: {}, props: {query: {}}},
        {route: routes.children[1].children[0], match: {}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[1].children[0], match: {}, props: {query: {}}}
      ]
    });

    itMatches(routes, '/users/me', {
      path: '/users/me',
      route: routes.children[1].children[0].children[0],
      trace: [
        {route: routes, match: {_: ['/users/me/']}, props: {query: {}}},
        {route: routes.children[1], match: {_: ['me/']}, props: {query: {}}},
        {route: routes.children[1].children[0], match: {_: ['me/']}, props: {query: {}}},
        {route: routes.children[1].children[0].children[0], match: {user: 'me'}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[1].children[0].children[0], match: {user: 'me'}, props: {query: {}}}
      ]
    });

    itMatches(routes, '/users/me/albums', {
      path: '/users/me/albums',
      route: routes.children[1].children[0].children[0].children[0],
      trace: [
        {route: routes, match: {_: ['/users/me/albums/']}, props: {query: {}}},
        {route: routes.children[1], match: {_: ['me/albums/']}, props: {query: {}}},
        {route: routes.children[1].children[0], match: {_: ['me/albums/']}, props: {query: {}}},
        {route: routes.children[1].children[0].children[0], match: {user: 'me', _: ['albums/']}, props: {query: {}}},
        {route: routes.children[1].children[0].children[0].children[0], match: {}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[1].children[0].children[0].children[0], match: {}, props: {query: {}}}
      ]
    });

    itMatches(routes, '/users/me/songs', {
      path: '/users/me/songs',
      route: routes.children[1].children[0].children[0].children[1],
      trace: [
        {route: routes, match: {_: ['/users/me/songs/']}, props: {query: {}}},
        {route: routes.children[1], match: {_: ['me/songs/']}, props: {query: {}}},
        {route: routes.children[1].children[0], match: {_: ['me/songs/']}, props: {query: {}}},
        {route: routes.children[1].children[0].children[0], match: {user: 'me', _: ['songs/']}, props: {query: {}}},
        {route: routes.children[1].children[0].children[0].children[1], match: {_: ['songs']}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[1].children[0].children[0].children[1], match: {_: ['songs']}, props: {query: {}}}
      ]
    });

  });

  describe('composite routes mounted externally', function() {

    var productsRoutes = (
      <Routes name="products" view="Products">
        <Route name="create-product" path="create" view="Products" />
        <Route name="edit-product" path=":id" editView="EditProduct" />
      </Routes>
    );

    var routes = (
      <Routes>
        <Route path="/products">{productsRoutes}</Route>
        <Route path="/orders" view="Orders" />
      </Routes>
    );

    itMatches(routes, '/products', {
      path: '/products',
      route: routes.children[0].children[0],
      trace: [
        {route: routes, match: {_: ['/products/']}, props: {query: {}}},
        {route: routes.children[0], match: {}, props: {query: {}}},
        {route: routes.children[0].children[0], match: {}, props: {query: {}}}
      ],
      activeTrace: [
        {route: routes.children[0].children[0], match: {}, props: {query: {}}}
      ]
    });

  });

});
