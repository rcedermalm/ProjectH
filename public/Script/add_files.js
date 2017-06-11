
/*********************************** FILE PICKER ***********************************************/
//Changes the text in the file picker depending on the chosen files

$(document).on('change', '.btn-file :file', function(value) {
    console.log(value);
        var input = $('.filename'),
            numFiles = value.target.files ? value.target.files.length : 1,
            label = value.target.files[0].name.replace(/\\/g, '/').replace(/.*\//, '');
        //If only one file is chosen, write the file name
        if(numFiles == 1)
        {
          input.val(label);
        }
        //If more files are chosen, only write the number of files
        else
        {
          input.val(numFiles + " files chosen");
        }
});

//Function to get the correct path to the chosen files from the shared storage 
//Used to upload to the database

//Global variables to store the filepath
//Also uset in POST request for importing data
var directory; 
var folder;
function selectFolder(e) {
    //Folder select
    var theFiles = e.target.files;
    var relativePath = theFiles[0].webkitRelativePath;
    folder = relativePath.split("/");
    directory = 'C:\\\\temp\\\\SharedStorage\\\\' + folder[0];

    //Display files in a list
    var input = document.getElementById('file');
    var output = document.getElementById('fileList');

    output.innerHTML = '<ul>';
    for (var i = 0; i < input.files.length; ++i) {
      output.innerHTML += '<li class ="list-group-item">' + input.files.item(i).name + '</li>';
    }
    output.innerHTML += '</ul>';
}

/******************************* END FILE PICKER ********************************************/

//Function to refresh page, e.g after adding an entry
function reloadPage(){
    location.reload();
}

/****************************** HIGHLIGHTING LABELS ******************************************/
//Used to create highlight over Labels 
$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});

//Used to create highlight over Labels
$('.bootstrap-tagsinput').focusin(function() {
  $(this).addClass('focus');
});
//Used to create highlight over Labels
$('.bootstrap-tagsinput').focusout(function() {
  $(this).removeClass('focus');
});

/***************************** END HIGHLIGHTING LABELS ***************************************/



/******************************** FORM HANDLING ***********************************************/


// Post files in the database using POST in storeRequest
// url: C:\\temp\\SharedStorage\\nyTest123
// Create angular controller and pass $scope and $http
// This handles the input from the user
app.controller('AddController', function($scope, $http) {

  /**************************** CUSTOM FIELDS ************************************/
  $(".custom-fields:first").hide(); //hide template

  // Add new items, based on hidden template, when add button (+) is clicked 
  $(".add-more").click(function() {
    //Clone template item
    var newItem = $(".custom-fields:first").clone();
    //rewrite template item's ids for key to avoid duplicates
    newItem.find("input1").attr("id", "field" + ($(".custom-fields").length + 2)); 
    //rewrite template item's ids for value to avoid duplicates
    newItem.find("input2").attr("id", "field" + ($(".custom-fields").length + 2));
    //newItem.find("input1").attr("ng-model", "Info.Key" + ($(".custom-fields").length + 2)); //rewrite id's to avoid duplicates
    //newItem.find("input2").attr("ng-model", "Info.Value" + ($(".custom-fields").length + 2)); //rewrite id's to avoid duplicates
    //show clone of template
    newItem.show(); 
    $(".custom-fields:last").after(newItem);
    bindRemove();
  });

  // Bind remove function to last added button
  function bindRemove() {
    //If remove button (X) is clicked, remove last item
    $(".remove:last").click(function(e) {
      if ($(".remove").length > 1)
        $(this).parents(".custom-fields").remove();
    });
  }
  //Execute bind-function at startup 
  bindRemove();

  /*********************** END CUSTOM FIELDS *******************************/

  /**************************** SEND DATA ************************************/
  //Function to add data to database using POST request
  //$scope will allow input to pass between controller and view
  $scope.SendData = function () {
    //Variable to store information about files to be passed as an argument in POST request
    var data = { 'Directory': directory,
      'Types': [$scope.dataTypes],
      'ErrorActionPreference': 0
    };
    //Variable with headers to be passed as an argument in POST request
    var config = {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }

    //POST request to import data to the database
    $http.post('http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/StoreRequests', data, config)
    //If import was successful
    .success(function (data, status, headers, config) {
      //Give user feedback
      $scope.content = "Files were successfully imported to the database.";
      /*var alertMsg = document.getElementById('successMsg');                        <- Experiment    
        alertMsg.style.visibility = 'visible';*/ 
      alert($scope.content);
      //Refresh page
      location.reload();
    })
    //If import was unsuccessful
    .error(function (data, status, headers, config) {
      //Give user feedback
      $scope.content = "Caution! Import unsuccessful";
      alert($scope.content);
    });
  };

  /************************** END SEND DATA *********************************/


  /************************* WRITE JSON FILE ********************************/
  //Add date to info in json file
  var today = new Date();
  $scope.Info = { "Import Date" : today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate(),}

    //FUnction to process the form for the json file
    //$scope will allow input to pass between controller and view
    $scope.processForm = function() {
      //File structure with comments from sectra
      var jsonData = { 
                "Tags":   $scope.Tags.split(","),      // $scope.Tags is a string with all the tags, and are divided by the function .split(","). This is because the tags-input divide all the tags by comma.
                "Paths":  [""],                        // Requested to be empty, for now
                "Info":   $scope.Info                  // This is where all the other info go, i.e: Creator, Import date, Labels etc...                                                     
      };
      console.log(jsonData);

      //POST request save json file in the selected folder to be imported to the database
      $http({
      method  : 'POST',
      url     : '/filepath',
      data    : folder[0],  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      });

      $http({
      method  : 'POST',
      url     : '/upload',
      data    : $.param(jsonData),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)


    })};

  /************************ END WRITE JSON FILE ******************************/


});
/******************************* END FORM HANDLING *********************************************/


/************************************** MODAL **************************************************/
//Function to pass form input to modal
//The function displays the inputform with corresponding input in a modal page
//Used as an overview for the user before completing the import
function modalFunction() {
    $('#directory').val(folder);
    $('#data-types').val(angular.element($("#ngController")).scope().dataTypes);
    $('#creator').val(angular.element($("#ngController")).scope().Info.Creator);
    $('#TDID').val(angular.element($("#ngController")).scope().Info.TestDataID);
    $('#TCID').val(angular.element($("#ngController")).scope().Info.TestCaseID);
    $('#patient-name').val(angular.element($("#ngController")).scope().Info.NewPatientName);
    $('#labels').val(angular.element($("#ngController")).scope().Tags);
    $('#description').val(angular.element($("#ngController")).scope().Info.Description);
    $('#anonymized').val(angular.element($("#ngController")).scope().Info.Anonymized);

}
/************************************ END MODAL ************************************************/
