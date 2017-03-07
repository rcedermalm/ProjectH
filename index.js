var app = angular.module("TDDB", ["ngRoute"]);
  app.config(function($routeProvider) {
    $routeProvider
    .when("/", {templateUrl : "main.html"})
    .when("/page_search", {templateUrl : "search.html"})
    .when("/page_add", {templateUrl : "add_files.html"})
    .when("/page_test", {templateUrl : "test.html"});
  });