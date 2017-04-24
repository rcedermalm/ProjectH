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

        // To keep the object array as a "global" array.
        show_data_array = the_patients;

        // "Returns" the patient array, the data will be stored in the variable "show_data"
        $scope.show_data = the_patients;

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
