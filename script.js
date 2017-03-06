 
//SIDEBAR
$("#menu-toggle").click(function(e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
});



//DRAG AND DROP
function dragstart_handler(ev) {
  console.log("dragStart");
  // Change the source element's background color to signify drag has started
 
  // Add the id of the drag source element to the drag data payload so
  // it is available when the drop event is fired
  ev.dataTransfer.setData("text", ev.target.id);
  // Tell the browser both copy and move are possible
  ev.effectAllowed = "copyMove";
}

function dragover_handler(ev) {
  console.log("dragOver");
  ev.currentTarget.style.background = "#333333";
  
  // Change the target element's border to signify a drag over event
  // has occurred
  //ev.currentTarget.style.background = "lightblue";
  ev.preventDefault();
}

function dragleave_handler(ev){
	console.log("dragLeave");
	ev.currentTarget.style.background = "#000000";
}

var has_been_dragged = false;

function drop_handler(ev) {
  console.log("Drop");
  ev.preventDefault();
  
  // Get the id of drag source element (that was added to the drag data
  // payload by the dragstart event handler)
  var id = ev.dataTransfer.getData("text");
  ev.currentTarget.style.background = "#000000";

  // Copy the element if the source and destination ids are both "copy"
  if (id == "src_copy" && ev.target.id == "target" && !has_been_dragged) {
  	has_been_dragged = true;

   var nodeCopy = document.getElementById(id).cloneNode(true);
   nodeCopy.id = "newId";
   ev.target.appendChild(nodeCopy);
  }
}
function dragend_handler(ev) {
  console.log("dragEnd");
  // Restore source's border

  var el=document.getElementById("src_copy");
 	el.style.background = "#666666";


  // Remove all of the drag data
  ev.dataTransfer.clearData();
}
