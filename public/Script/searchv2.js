/* Formatting function for row details - modify as you need */

 
$(document).ready(function() {
    var table = $('#example').DataTable( {
        "ajax": {"url":"testTable/data/Sectra.json","dataSrc": "Result"},
         "columns": [
            { "data": "Id" },
            { "data": "Type" }
          ]
        
    } );
} );