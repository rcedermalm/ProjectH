// The URL to the API.
var sectraAPI = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/TestData?q=*&from=0&size=1000";

// Will contain the objects read from the database.
var show_data_array = new Array();

// A controller for getting and showing the data.
app.controller('show_data_ctrl', function ($scope, $http, $mdDialog) {
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
    // Delete function, this part deletes an ENTRYITEM, in values are objectID and objectType, objectID is the id to be removed, objectType is
    // the type like dicom  

    $scope.deleteEntryItem = function(ev, objectID, objectType) {
    var confirm = $mdDialog.confirm()
          .title('Delete Entry')
          .textContent('Are you sure you want do delete the entry item with ID: ' + objectID + ", of the type: " + objectType)
          .ariaLabel('Close')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');

    // Upon confirming the delete request will be sent.
    $mdDialog.show(confirm).then(function() {
      console.log("http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/TestData/BulkDelete/" + objectType + "?purge=true", [objectID]);
       $http({
         method: 'DELETE',
         url: 'http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/TestData/BulkDelete/' + objectType + '?purge=true' ,
         data: [objectID],
         headers: {
        "Content-type": "application/json",
        "Accept" : "application/json"
        }
       }).success(function(data, status, headers) {
            console.log(data);
           var row = document.getElementById(objectID);
            row.style.display = "none";

      })
    })
    }
    

    function DialogController($scope, $mdDialog) {  
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    };


  /***************************************************************************/
  /******************************** EDIT DATA ********************************/
  /***************************************************************************/  

  // The ID of the testdata that has been chosen to edit
  var the_edit_ID;

  // Function for setting the initial values in the edit modal for the chosen testdata.
  $scope.editInitData = function(ev){
      var edit_id = ev.target.id;
      the_edit_ID = edit_id;
      var the_object;

      // Find the object with the gotten ID
      for(var i = 0; i < show_data_array.length; i++){
        for(var j = 0; j < show_data_array[i].objects.length; j++){
          if(show_data_array[i].objects[j].Id == edit_id){
            the_object = show_data_array[i].objects[j];
            break;
          }
        }
      }

      // Sets the value of the input fields to the values the already have.
      $('#edit-creator').val(the_object.Document["Attributes"]["Info"]["Creator"]);
      $('#edit-TDID').val(the_object.Document["Attributes"]["Info"]["TestDataID"]);
      $('#edit-TCID').val(the_object.Document["Attributes"]["Info"]["TestCaseID"]);
      $('#edit-patient-name').val(the_object.Document["Attributes"]["Info"]["NewPatientName"]);
      $('#edit-tags').val(the_object.Document["Attributes"]["Tags"]);
      $('#edit-description').val(the_object.Document["Attributes"]["Info"]["Description"]);
      if(the_object.Document["Attributes"]["Info"]["Anonymized"] == "true")
        document.getElementById("edit-anonymize").checked = true;
      else
        document.getElementById("edit-anonymize").checked = false;

    };


    // Function that edits the data written by the user.
    $scope.editDataFunction = function(){
      // Get the values from the input fields
      var new_creator = $('#edit-creator').val();
      var new_TDID = $('#edit-TDID').val();
      var new_TCID = $('#edit-TCID').val();
      var new_patient_name = $('#edit-patient-name').val();
      var new_tags = $('#edit-tags').val();
      var new_description = $('#edit-description').val();
      if($('#edit-anonymize').val() == "on")
        var new_anonymized = true;    
      else
        var new_anonymized = false;

      // RequestURL for getting the entry for the testdata
      var getEntryURL = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/Entries?q=" + the_edit_ID + "&from=0&size=1";
      
      // GET request for getting the entry
      $http.get(getEntryURL).then(function(response){
        var testDataEntryID = response.data.Result[0].Id;
        var RootDirectory = response.data.Result[0].RootDirectory;
        var DocIdsToPaths = response.data.Result[0].DocIdsToPaths;
        var ImportDate = response.data.Result[0].Info["Import Date"];
        
        // Create the testdataentry for the PUT request
        var testDataEntry = {
          "Id": testDataEntryID,
          "RootDirectory": RootDirectory,
          "DocIdsToPaths": DocIdsToPaths,
          "Info": {
            "Import Date": ImportDate,
            "Anonymized": new_anonymized,
            "Creator": new_creator,
            "TestDataID": new_TDID,
            "TestCaseID": new_TCID,
            "NewPatientName": new_patient_name,
            "Description": new_description
          },
          "Tags": new_tags.split(","),
          "Status": 2,
          "StatusMessage": ""
        }

        // RequestURL for the PUT request
        var requestURL = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Entries/" + testDataEntryID;
        console.log(testDataEntry);
        console.log(requestURL);

      /*
        // PUT request for updating the entry (and thereby also the testdata) 
        $http({
          method  : 'PUT',
          url     : requestURL,
          data    : testDataEntry,
          headers: {
          "Content-type": "application/json",
          "Accept" : "application/json"
          } 
        }).success(function(data, status, headers) {
              console.log(data);
              console.log("status: " + status);
        });*/
      
      });
    };




});