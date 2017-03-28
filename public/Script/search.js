var sectraAPI = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/TestData?q=*";

app.controller('show_data_ctrl', function($scope, $http) {
    $http.get(sectraAPI).then(function(response) {
        var the_data = response.data.Result;
        console.log(the_data);
        /*var the_data = new Array();
        for(var i = 0; i < response.data.Result.length;i++){
            //var patient = encodeURI(response.data.Result.Document.(0010,0010));
            the_data.push({
                "type": response.data.Result.Type,
                "id": response.data.Result.Id,
                //"patient_name": response.data.Result.Document + ".(0010,0010)"
                //"patient_name": patient
            })
        }*/
        $scope.show_data = the_data;
    });
});
