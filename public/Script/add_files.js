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


// Create angular controller and pass in $scope and $http
// This handles the input from the user, it is possible to add more paramenters
// for the user input
app.controller('AddController', function($scope, $http) {
  
   // create a blank object to hold our form information
    // $scope will allow this to pass between controller and view
      $scope.formData = {};

    // process the form
    $scope.processForm = function() {
      $http({
      method  : 'POST',
      url     : '/upload',
      data    : $.param($scope.formData),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
    })};

});


