// The URL to the API.
var sectraAPI = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/TestData?q=*&from=0&size=1000";

// Will contain the objects read from the database.
var show_data_array = new Array();


// A controller for getting and showing the data.
app.controller('show_data_ctrl', function ($scope, $http) {
    $scope.loading = true;
    $http.get(sectraAPI).then(function (response) {
        // Create a new array with patients, the "key" is the patient´s name
        var the_patients = new Array();
        var size = response.data.Result.length;

        // Loop though the json´s Result tag
        for (var i = 0; i < size; i++) {
            // What should we do about txtfiles??? They do not have a "name".
            if (response.data.Result[i].Type == "dicom") {
                // Get the name from the dicom tag
                var name = response.data.Result[i].Document["(0010,0010)"];
                // Check if the name is already in the patient array, returns the index, 
                // if not found it returns -1.
                var index = the_patients.findIndex(x => x.name == name);

                // If the name is not in the array, add it. 
                if (index == -1) {
                    // the_objects is the array with all the files from the same patient.
                    var the_objects = new Array();
                    var the_modalities = new Array();
                    var the_tags = new Array();

                    the_patients.push({
                        "name": name,
                        "objects": the_objects,
                        "modalities": the_modalities,
                        "tags": the_tags
                    })
                    index = the_patients.length - 1;
                }
                // Add the file to the patient´s object array
                (the_patients[index].objects).push(response.data.Result[i]);

                // Add the modality of the file if it is not already in modalitites.
                var modality_exists_already = false;

                for(var j = 0; j < the_patients[index].modalities.length; j++){
                  if(the_patients[index].modalities[j] == response.data.Result[i].Document["(0008,0060)"]){
                    modality_exists_already = true;
                  }
                }
                if(!modality_exists_already){
                  (the_patients[index].modalities).push(response.data.Result[i].Document["(0008,0060)"]);
                }

                // Add the tags if they do not already exist in tags //
                var tag_exists_already = false;

                for(var k = 0; k < response.data.Result[i].Document["Attributes"]["Tags"].length; k++){
                  for(var j = 0; j < the_patients[index].tags.length; j++){
                    if(the_patients[index].tags[j] == response.data.Result[i].Document["Attributes"]["Tags"][k]){
                      tag_exists_already = true;
                    }
                  }
                  if(!tag_exists_already){
                    (the_patients[index].tags).push(response.data.Result[i].Document["Attributes"]["Tags"][k]);
                  }
                  else{
                    tag_exists_already = false;
                  }
                }  
            }

        }

        // Just for checking that the patient array is the way it should be, could be deleted.
        /*for(var i = 0; i < the_patients.length; i++){
            console.log("jesö" + the_patients[i].modalities.length);
            for(var j = 0; j < the_patients[i].modalities.length; j++)
            console.log(the_patients[i].modalities[j]);
        }*/

        // To keep the object array as a "global" array.
        show_data_array = the_patients;

        // "Returns" the patient array, the data will be stored in the variable "show_data"
        $scope.show_data = the_patients;
        $scope.show_data_length = the_patients.length;

      }).finally(function () {
        $scope.loading = false;
      });



      /** FOR SORTING THE TABLE **/
      $scope.property_name = 'name';
      $scope.reverse = true;

      $scope.sortBy = function (property_name) {
        $scope.reverse = ($scope.property_name === property_name) ? !$scope.reverse : false;
        $scope.property_name = property_name;
      };

      /***************************/

      /** FOR EXPANDING THE LIST **/
      $scope.xExpand = function (x, parent) {
        x.expanded = !x.expanded;
        if (!x.expanded && parent) collapseAll(x);
      }
      function collapseAll(x) {
        for (var i = 0; i < x.objects.length; i++) {
            x.objects[i].expanded = false;
        }
      }
      
      var limitStep = 5;
      $scope.limit = 20;

      $scope.incrementLimit = function () {
        $scope.limit += limitStep;
      };
      $scope.decrementLimit = function () {
        $scope.limit -= limitStep;
      };
      
      /****************************/


    
});
