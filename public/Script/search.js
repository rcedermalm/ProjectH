var sectraAPI = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/TestData?q=cr";

//var show_data_app = angular.module('show_data_app', []);
app.controller('show_data_ctrl', function($scope, $http) {
    $http.get(sectraAPI).then(function(response) {
        $scope.show_data = response.data.Result;
    });
});
