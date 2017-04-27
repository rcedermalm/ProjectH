 
/** SIDEBAR **/
$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});


/** CHECK THE USER'S WINDOWSIZE **/
window.onresize = displayWindowSize;
window.onload = displayWindowSize;
function displayWindowSize() {
    my_width = window.innerWidth;
    my_height = window.innerHeight;
    // your size calculation code here
    document.getElementById("dimensions").innerHTML = my_width + "x" + my_height;
};


/** DRAG AND DROP **/
var has_been_dragged = false;

function dragstartHandler(ev) {
  console.log("dragStart");
 
  // Add the id of the drag source element to the drag data payload so
  // it is available when the drop event is fired
  ev.dataTransfer.setData("name", ev.target.id);

  // Tell the browser both copy and move are possible
  ev.effectAllowed = "copy";
}

function dragoverHandler(ev) {
  console.log("dragOver");

  // Change the color of the target if someone
  ev.currentTarget.style.background = "white";

  ev.preventDefault();
}

function dragleaveHandler(ev){
	console.log("dragLeave");

	// Change the color of the target back to normal
	ev.currentTarget.style.background = "#abad9f";
}

var objectsInDropZone = new Array();


function dropHandler(ev) {
  console.log("Drop");
  ev.preventDefault();
  
  // Get the id of drag source element (that was added to the drag data
  // payload by the dragstart event handler)
  var id = ev.dataTransfer.getData("name");

  // Change the color of the target back to normal
  ev.currentTarget.style.background = "#abad9f";



  // Copy the element if the source and destination ids are both "copy" and 
  // the element has not been dragged before
  if (ev.target.id == "target") {
    var node_copy = document.getElementById(id).cloneNode(true);
    node_copy.style.color = "white";
    node_copy.style.background = "#abad9f";
    node_copy.id = "new_id";

    ev.target.appendChild(node_copy);

    // find the name in our array of objects
    var index = show_data_array.findIndex(x => x.name == id);

    // add the object to a new array that stores all the objects that have been
    // dragged to the drop zone
    objectsInDropZone.push(show_data_array[index]);

    // Change the background color of the element if is has been dropped 
    // in a valid target
    var element_in_list = document.getElementById(id);
    element_in_list.style.background = "#999999";
    element_in_list.style.color = "black";
    console.log(id);
  }
}

function dragendHandler(ev) {
  console.log("dragEnd");

	// Remove all of the drag data
	ev.dataTransfer.clearData();
}

function sendFiles(){
  var alert_text = "The objects: ";
  for(var i = 0; i < objectsInDropZone.length; i++){
    alert_text = alert_text + objectsInDropZone[i].name;

    if(i != objectsInDropZone.length - 1){
      alert_text = alert_text + ", ";
    }
  }

  alert_text = alert_text + "\nare sent to test.";
  alert(alert_text);
}