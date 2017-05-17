
/******************** FILE PICKER **************************/
var directory; 
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
function selectFolder(e) {
    var theFiles = e.target.files;
    var relativePath = theFiles[0].webkitRelativePath;
    var folder = relativePath.split("/");
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

// Post files in the database using POST in storeRequest
// url: C:\\temp\\SharedStorage\\nyTest123

// Create angular controller and pass in $scope and $http
// This handles the input from the user, it is possible to add more paramenters
// for the user input
app.controller('AddController', function($scope, $http) {

  $scope.SendData = function () {
    // use $.param jQuery function to serialize data from JSON, $scope.inputDirectory
    var data = { 'Directory': directory,
      'Types': [$scope.inputTags],
      'ErrorActionPreference': 0
    };
    console.log(data);

    var config = {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }

    $http.post('http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/StoreRequests', data, config)
    .success(function (data, status, headers, config) {
      $scope.PostDataResponse = data;
      $scope.content = "Success.";
    })
    .error(function (data, status, headers, config) {
      $scope.ResponseDetails = "Data: " + data +
        "<hr />status: " + status +
        "<hr />headers: " + headers +
        "<hr />config: " + config;
      $scope.content = "Failure.";
    });
  };

  var today = new Date();

  $scope.Info = { "Import Date" : today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate(),
    
  }
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
    //Change this, show the chosen folder?
    //$('#directory').val($('#directory-init').val());
    $('#labels').val($('#labels-init').val());
    $('#creator').val($('#creator-init').val());
    $('#TDID').val($('#TDID-init').val());
    $('#TCID').val($('#TCID-init').val());
    $('#patient-name').val($('#patient-name-init').val());
   // $('#tags').val($('#tags-init').val());
    $('#comments').val($('#comments-init').val());
   // $('#anonymized').val($('#anonymized-init').val());

}


