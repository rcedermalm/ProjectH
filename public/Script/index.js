var app = angular.module("TDDB", ["ngRoute"]);
  app.config(function($routeProvider) {
    $routeProvider
    .when("/", {templateUrl : "Source/main.html"})
    .when("/page_search", {templateUrl : "Source/search.html"})
    .when("/page_add", {templateUrl : "Source/add_files.html"})
    .when("/page_test", {templateUrl : "Source/test.html"});
  });

