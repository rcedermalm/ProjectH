/* Formatting function for row details - modify as you need */
function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Full name:</td>'+
            '<td>'+d.name+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Extension number:</td>'+
            '<td>'+d.extn+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Extra info:</td>'+
            '<td>And any further details here (images etc)...</td>'+
        '</tr>'+
    '</table>';
}
 
$(document).ready(function() {
    var sectraAPI = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/TestData?q=*";

        var table = $('#mainTable').DataTable( {
        "ajax": {"url":sectraAPI,"dataSrc": "Result"},
        
         "columns": [
            { "data": "Document.(0010,0010)",
              "defaultContent": "undefined"},
            { "data": "Document.(0008,0060)",
              "defaultContent": "undefined"},
            { "data": "Type" }

          ]
        
    } );
     
    // Add event listener for opening and closing details
    $('#mainTable tbody').on('click', 'td.table-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
} );