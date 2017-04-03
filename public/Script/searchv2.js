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

/* Formatting function for row details - modify as you need */
/*function format ( d ) {
    // `d` is the original data object for the row

    console.log(d.data_array.length)

    var the_format = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';

    for(var i = 0; i < d.data_array.length; i++){

        the_format += '<tr>' + 
                    '<td>' + d.data_array[i].patient_name + '</td>' +
                  '</tr>';  
    }
    the_format += '</table>';
    console.log(i);

    return the_format;
}

 
$(document).ready(function() {
    

        var table = $('#mainTable').DataTable( {
        "ajax": {
            "url":sectraAPI,
            //"dataSrc": "Result"
            "dataSrc": function (json) {
                                                            
                console.log("hfi")
                  var return_data = new Array();
                  var dicom_data = new Array();
                  var txt_data = new Array();

                  for(var i = 0; i < json.Result.length; i++){    
                  console.log("hej")                                          
                    if(json.Result[i].Type == "dicom"){
                        dicom_data.push({
                            "id": json.Result[i].Id,
                            "type": json.Result[i].Type,
                            "patient_name": json.Result[i].Document.(0010,0010)
                            
                            //"modality": json.Result[i].Document.(0008,0060),
                            
                            //"accession_number": json.Result[i].Document.(0008,0050),
                            //"series_instance_UID": json.Result[i].Document.(0020,000E),
                            //"study_id": json.Result[i].Document.(0020,0010)
                        })
                    }
                    else{
                        txt_data.push({
                            "patient_name": "undefined",
                            "type": json.Result[i].Type,
                            "modality": "undefined",
                            "id": json.Result[i].Id,
                            "accession_number": "undefined",
                            //"series_instance_UID": "undefined",
                            "study_id": "undefined"
                        })
                    }

                    return_data.push({
                      'Type': json.Result[i].Type,
                      'Name': json.Result[i].Document.(0010, 0010)
                      'Modality' : json.Result[i].Document.(0008,0060),

                    })
                  }


                  return_data.push({
                    "type": "dicom",
                    "data_array": dicom_data
                  })


                  return_data.push({
                    "type": "txt",
                    "data_array": txt_data
                  })

                  return return_data;
                }

        },
        
         "columns": [
            { "data": "Document.(0010,0010)",
              "defaultContent": "undefined"},
            { "data": "Document.(0008,0060)",
              "defaultContent": "undefined"},
            { "data": "type", 
              "className": "table-control"},
            /*{ "data": "Name",
              "defaultContent": "undefined"},
            { "data": "Modality",
              "defaultContent": "undefined"}  
        

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
} );*/