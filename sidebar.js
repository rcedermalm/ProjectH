 
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
  ev.dataTransfer.setData("text", ev.target.id);

  // Tell the browser both copy and move are possible
  ev.effectAllowed = "copy";
}

function dragoverHandler(ev) {
  console.log("dragOver");

  // Change the color of the target if someone
  ev.currentTarget.style.background = "#333333";

  ev.preventDefault();
}

function dragleaveHandler(ev){
	console.log("dragLeave");

	// Change the color of the target back to normal
	ev.currentTarget.style.background = "#000000";
}

function dropHandler(ev) {
  console.log("Drop");
  ev.preventDefault();
  
  // Get the id of drag source element (that was added to the drag data
  // payload by the dragstart event handler)
  var id = ev.dataTransfer.getData("text");

  // Change the color of the target back to normal
  ev.currentTarget.style.background = "#000000";

  // Copy the element if the source and destination ids are both "copy" and 
  // the element has not been dragged before
  if (id == "src-copy" && ev.target.id == "target" && !has_been_dragged) {
  	has_been_dragged = true;
    var node_copy = document.getElementById(id).cloneNode(true);
    node_copy.id = "new_id";
    ev.target.appendChild(node_copy);

    // Change the background color of the element if is has been dropped 
    // in a valid target
    var el = document.getElementById("src-copy");
    el.style.background = "#666666";
    el.style.color = "#999999";
  }
}

function dragendHandler(ev) {
  console.log("dragEnd");

	// Remove all of the drag data
	ev.dataTransfer.clearData();
}
