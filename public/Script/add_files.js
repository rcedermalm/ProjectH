/*

//Function to handle selected files from computer
function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object

  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {

    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }

    //To read the chosen file
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        var span = document.createElement('span');
        span.innerHTML = ['<img class="thumb" src="', e.target.result,
                          '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('list').insertBefore(span, null);
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

//document.getElementById('files').addEventListener('change', handleFileSelect, false);

*/

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

        var jsonObj = {'Key' : $scope.KEYZ, 'value': $scope.VALUEZ};
        $("input1").each(function() {
            var key = $(this).attr("id");
            var val = $(this).val();

            item = {}
            item ["id"] = key;
            item ["value"] = val;

            jsonObj.push(item);
        });

        console.log(jsonObj);

  $scope.SendData = function () {
    // use $.param jQuery function to serialize data from JSON 
    var data = { 'Directory': $scope.inputDirectory,
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
    $('#directory').val($('#directory-init').val());
    $('#labels').val($('#labels-init').val());
    $('#creator').val($('#creator-init').val());
    $('#TDID').val($('#TDID-init').val());
    $('#TCID').val($('#TCID-init').val());
    $('#patient-name').val($('#patient-name-init').val());
   // $('#tags').val($('#tags-init').val());
    $('#comments').val($('#comments-init').val());
   // $('#anonymized').val($('#anonymized-init').val());

}


//Function to give feedback that files have been added to database
function addFunction() {
  alert("Files were added to the database!");
}