var app = angular.module("TDDB", ["ngRoute","ngMaterial"]);
  app.config(function($routeProvider) {
    $routeProvider
    .when("/", {templateUrl : "Source/search.html"})
    .when("/page_search", {templateUrl : "Source/search.html"})
    .when("/page_add", {templateUrl : "Source/add_files.html"})
    .when("/page_test", {templateUrl : "Source/test.html"});
  });

  app.controller('sideBar', function($scope, $location){
      $scope.isActive = function(route) {
        return route === $location.path();
    }
  })

