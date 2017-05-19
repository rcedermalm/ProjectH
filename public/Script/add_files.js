
/******************** FILE PICKER **************************/
$(document).on('change', '.btn-file :file', function(value) {
    console.log(value);
        var input = $('.filename'),
            numFiles = value.target.files ? value.target.files.length : 1,
            label = value.target.files[0].name.replace(/\\/g, '/').replace(/.*\//, '');
        if(numFiles == 1)
        {
          input.val(label);
        }
        else
        {
          input.val(numFiles + " files chosen");
        }

        /* Printing the name of the chosen files, not working properly
        var output = $('.file-output'),
          $(numFiles).each([0,numFiles], function(value)
          {
            label = value.target.files[i].name.replace(/\\/g, '/').replace(/.*\//, '') + "<br>";
            output.val(label);
          });  */
});

//Function to get the correct path to the chosen files from the shared storage so that they can be uploaded to the database
var directory; 
var folder;
function selectFolder(e) {
    var theFiles = e.target.files;
    var relativePath = theFiles[0].webkitRelativePath;
    folder = relativePath.split("/");
    directory = 'C:\\\\temp\\\\SharedStorage\\\\' + folder[0];
}

/******************** FILE PICKER **************************/

//Function to refresh page, e.g after adding an entry
function reloadPage() {
    location.reload();
}

//Used to create highlight over Labels (?)
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




//Variables to show anonymization and tags in modal
var modalAnonymize;
var modalTags;

// Post files in the database using POST in storeRequest
// url: C:\\temp\\SharedStorage\\nyTest123
// Create angular controller and pass in $scope and $http
// This handles the input from the user, it is possible to add more paramenters
// for the user input
app.controller('AddController', function($scope, $http) {


  //Custom fields 
  $(".custom-fields:first").hide(); //hide template

      /* Add new item based on hidden template */
      $(".add-more").click(function() {
        var newItem = $(".custom-fields:first").clone();
        newItem.find("input1").attr("id", "field" + ($(".custom-fields").length + 2)); //rewrite id's to avoid duplicates
        newItem.find("input2").attr("id", "field" + ($(".custom-fields").length + 2)); //rewrite id's to avoid duplicates
        //newItem.find("input1").attr("ng-model", "Info.Key" + ($(".custom-fields").length + 2)); //rewrite id's to avoid duplicates
        //newItem.find("input2").attr("ng-model", "Info.Value" + ($(".custom-fields").length + 2)); //rewrite id's to avoid duplicates
        newItem.show(); //show clone of template
        $(".custom-fields:last").after(newItem);
        bindRemove();
      });

      /* Bind remove function to last added button*/
      function bindRemove() {
        $(".remove:last").click(function(e) {
          if ($(".remove").length > 1)
            $(this).parents(".custom-fields").remove();
        });
      }

      /* Execute bind-function at startup */
      bindRemove();

      //Test custom fields
      /*var jsonObj = {'Key' : $scope.KEYZ, 'value': $scope.VALUEZ};
      $("input1").each(function() {
          var key = $(this).attr("id");
          var val = $(this).val();

          item = {}
          item ["id"] = key;
          item ["value"] = val;

          jsonObj.push(item);
      });

        console.log(jsonObj);*/

  $scope.SendData = function () {
    // use $.param jQuery function to serialize data from JSON, $scope.inputDirectory
    var data = { 'Directory': directory,
      'Types': [$scope.inputTags],
      'ErrorActionPreference': 0
    };
    //console.log(data);

    var config = {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }

    $http.post('http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/StoreRequests', data, config)
    .success(function (data, status, headers, config) {
      $scope.content = "Files were successfully imported to the database.";
      alert($scope.content);
    })
    .error(function (data, status, headers, config) {
      $scope.content = "Caution! Files were not imported to the database.";
      alert($scope.content);
    });
  };


  var today = new Date();


  $scope.Info = { "Import Date" : today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate(),}


    // $scope will allow this to pass between controller and view
    // process the form
    $scope.processForm = function() {
      //File structure with comments from sectra
      var jsonData = { 
                "Tags":   $scope.Tags.split(","),      // $scope.Tags is a string with all the tags, and are divided by the function .split(","). This is because the tags-input divide all the tags by comma.
                "Paths":  [""],                        // Requested to be empty, for now
                "Info":   $scope.Info                  // This is where all the other info go, i.e: Creator, Import date, Labels etc...                                                     // Replace placeholder when the field in the HTML-code is correct
      };
      console.log(jsonData);

      //Copy value to modal variables
      if (!$scope.Info.Anonymized) {
        modalAnonymize = "false";
      }
      else{
        modalAnonymize = "true";
      }



      $http({
      method  : 'POST',
      url     : '/filepath',
      data    : $scope.inputDirectory,  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      });

      $http({
      method  : 'POST',
      url     : '/upload',
      data    : $.param(jsonData),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)


    })};


});


//Function to pass form input to modal
function modalFunction() {
    var hejhej = angular.element($("#ngController")).scope().Tags;
    console.log(hejhej);

    $('#directory').val(folder);
    $('#labels').val(angular.element($("#ngController")).scope().inputTags);
    $('#creator').val(angular.element($("#ngController")).scope().Info.Creator);
    $('#TDID').val(angular.element($("#ngController")).scope().Info.TestDataID);
    $('#TCID').val(angular.element($("#ngController")).scope().Info.TestCaseID);
    $('#patient-name').val(angular.element($("#ngController")).scope().Info.NewPatientName);
    $('#tags').val(angular.element($("#ngController")).scope().Tags);
    $('#description').val(angular.element($("#ngController")).scope().Info.Description);
    $('#anonymized').val(angular.element($("#ngController")).scope().Info.Anonymized);

}
