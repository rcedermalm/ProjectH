var sectraAPI = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/TestData?q=cr";

app.controller('show_data_ctrl', function($scope, $http) {
    $http.get(sectraAPI).then(function(response) {
        var the_data = response.data.Result;

        var the_patients = new Array();
        var size = response.data.Result.length;

        //
        for(var i = 0; i < size; i++){
            var name = response.data.Result[i].Document["(0010,0010)"];
            var index = the_patients.findIndex(x => x.name == name);
            
            if(index == -1){
                var the_objects = new Array();
                the_patients.push({
                    "name": name,
                    "objects": the_objects
                })
                index = the_patients.length - 1;
            }
            //console.log
            (the_patients[index].objects).push(response.data.Result[i]);    
            
        }    

        for(var i = 0; i < the_patients.length; i++){
            for(var j = 0; j < the_patients[i].objects.length; j++)
            console.log(the_patients[i].objects[j].Type);
        }

        /*
        var the_data = new Array();
        for(var i = 0; i < response.data.Result.length;i++){
            the_data.push({
                "Type": response.data.Result[i].Type,
                "Id": response.data.Result[i].Id,
                "patientName": response.data.Result[i].Document["(0010,0010)"]
            })
        }*/
        $scope.show_data = the_patients;
    });
});
