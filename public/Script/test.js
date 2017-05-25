
/*****************************************************/
/****************** TEST TABLE ***********************/
/*****************************************************/

app.controller('test_data_ctrl', function ($scope) {

	// Create array that are going to store the objects that has
	// been in the dropzone
	var objects_to_test = new Array();

	// Find the object's with the id's stored in the array objectsInDropZone
	for(var i = 0; i < objectsInDropZone.length; i++){
		for(var j = 0; j < show_data_array.length; j++){
			for(var k = 0; k < show_data_array[j].objects.length; k++){
				if(show_data_array[j].objects[k].Id == objectsInDropZone[i]){
					objects_to_test.push(show_data_array[j].objects[k]);
					break;
				}
			}
		}
	}

	// Save the result in the variable objects_to_test
	$scope.test_objects = objects_to_test;

	// Function to delete objects from the "test table" (removes the item from the array)
	$scope.deleteFromTest = function(id){
		var index_to_delete = objects_to_test.findIndex(x => x.Id == id);
		if(index_to_delete != -1)
			objects_to_test.splice(index_to_delete,1);  
	}

	// Function for sending the data to test. 
	$scope.sendToTest = function(){
		objects_to_test.splice(0, objects_to_test.length); // Clear the data
		alert("TestData was sent to test");
	}

});