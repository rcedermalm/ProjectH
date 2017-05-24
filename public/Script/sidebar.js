 
/** SIDEBAR **/
$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});


/** CHECK THE USER'S WINDOWSIZE **/
/*
window.onresize = displayWindowSize;
window.onload = displayWindowSize;
function displayWindowSize() {
    my_width = window.innerWidth;
    my_height = window.innerHeight;
    // your size calculation code here
    document.getElementById("dimensions").innerHTML = my_width + "x" + my_height;
};*/

/***************************************************************************/
/**************************** DRAG AND DROP ********************************/
/***************************************************************************/

function dragstartHandler(ev) {
  // Add the id of the drag source element to the drag data payload so
  // it is available when the drop event is fired
  ev.dataTransfer.setData("the_id", ev.target.id);

  // Tell the browser both copy and move are possible
  ev.effectAllowed = "copy";
}

function dragoverHandler(ev) {
  ev.preventDefault();

  // Change the color of the target if someone
  // hovers an object above the target
  ev.currentTarget.style.background = "white";
}

function dragleaveHandler(ev){
	// Change the color of the target back to normal
  // if the user leaves the target with the object
	ev.currentTarget.style.background = "#abad9f";
}

// Create array for the id´s of the objects in the target drop zone
var objectsInDropZone = new Array();

function dropHandler(ev) {
  ev.preventDefault();
  
  // Change the color of the target back to normal
  ev.currentTarget.style.background = "#abad9f";
  
  // Get the id of drag source element (that was added to the drag data
  // payload by the dragstart event handler)
  var id = ev.dataTransfer.getData("the_id");

  // Create array for the id's
  var the_ids = new Array(); 

  // Check if the the_id is a name or an id
  var name_index = show_data_array.findIndex(x => x.name == id);
  if(name_index != -1){
    for(var i = 0; i < show_data_array[name_index].objects.length; i++){
      the_ids.push(show_data_array[name_index].objects[i].Id);
    }
  }
  else{
    the_ids.push(id);
  }

  if (ev.target.id == "target") { // Check so that the object has been dropped in the dropzone
    for(var i = 0; i < the_ids.length; i++){
      if(objectsInDropZone.findIndex(x => x == the_ids[i]) == -1){
        var node_copy = document.getElementById(the_ids[i]).cloneNode(true); // Create a copy of the node
        
        // Change the style of the new node so that it matches the background of the target
        node_copy.style.color = "white";  
        node_copy.style.background = "#abad9f";

        ev.target.appendChild(node_copy); // Add the object in the target
        objectsInDropZone.push(the_ids[i]); // Add the id of the object in the array
      }
    }
  }
}

function dragendHandler(ev) {
	// Clear all the drag data
	ev.dataTransfer.clearData();
}

function sendFiles(){
  var alert_text = "The objects: ";
  for(var i = 0; i < objectsInDropZone.length; i++){
    alert_text = alert_text + objectsInDropZone[i];//.name;

    if(i != objectsInDropZone.length - 1){
      alert_text = alert_text + ", ";
    }
  }

  alert_text = alert_text + "\nare sent to test.";
  alert(alert_text);
}