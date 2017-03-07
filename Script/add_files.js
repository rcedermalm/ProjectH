$(document).ready( function() {
	$(':file').on('fileselect', function(event, numFiles, label) {
		console.log(numFiles);
		console.log(label);
	});
});

$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});

$('.bootstrap-tagsinput').focusin(function() {
	$(this).addClass('focus');
});
$('.bootstrap-tagsinput').focusout(function() {
	$(this).removeClass('focus');
});