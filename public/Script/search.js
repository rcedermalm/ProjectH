// The URL to the API.
var sectraAPI = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/TestData?q=*";

// A controller for getting and showing the data.
app.controller('show_data_ctrl', function($scope, $http) {
    $http.get(sectraAPI).then(function(response) {
        // Create a new array with patients, the "key" is the patient´s name
        var the_patients = new Array();
        var size = response.data.Result.length;

        // Loop though the json´s Result tag
        for(var i = 0; i < size; i++){
            // What should we do about txtfiles??? They do not have a "name".
            if(response.data.Result[i].Type == "dicom"){
                // Get the name from the dicom tag
                var name = response.data.Result[i].Document["(0010,0010)"];
                // Check if the name is already in the patient array, returns the index, 
                // if not found it returns -1.
                var index = the_patients.findIndex(x => x.name == name);
                
                // If the name is not in the array, add it. 
                if(index == -1){
                    // the_objects is the array with all the files from the same patient.
                    var the_objects = new Array();
                    the_patients.push({
                        "name": name,
                        "objects": the_objects
                    })
                    index = the_patients.length - 1;
                }
                // Add the file to the patient´s object array
                (the_patients[index].objects).push(response.data.Result[i]);
            }    
            
        }    

        /* Just for checking that the patient array is the way it should be, could be deleted.
        for(var i = 0; i < the_patients.length; i++){
            for(var j = 0; j < the_patients[i].objects.length; j++)
            console.log(the_patients[i].objects[j].Type);
        }*/

        // "Returns" the patient array, the data will be stored in the variable "show_data"
        $scope.show_data = the_patients;
    });
});
