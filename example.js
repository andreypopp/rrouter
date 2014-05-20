/**
 * @jsx React.DOM
 */
'use strict';

var Promise   = require('bluebird');
var Route     = require('./index');

function getItem(props) {
  return Promise.resolve('Item');
}

function getUser(props) {
  return Promise.resolve('User');
}

function getUsers(props) {
  return Promise.resolve('Users');
}

var ItemView = "ItemView";
var LoginView = "LoginView";
var UserPage = "UserPage";
var UsersPage = "UsersPage";

var routes = (
  <Route>
    <Route path="items/:id" promiseItem={getItem} view={ItemView} />
    <Route path="users" promiseUsers={getUsers} view={UsersPage}>
      <Route path="login" someProp="justProp" view={LoginView} />
      <Route path="logout" />
      <Route path=":id" promiseUser={getUser} view={UserPage} />
    </Route>
  </Route>
);

[
  '/users/userid',
  '/items/itemid',
  '/users',
  '/non-existent-page'
].forEach(function(path) {
  Route.route(routes, path).then(function(result) {
    console.log(path, result);
  }, function(err) { throw err; });
});
