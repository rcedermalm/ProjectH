// The URL to the API.
var sectraAPI = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/TestData?q=*&from=0&size=1000";

// Will contain the objects read from the database.
var show_data_array = new Array();


// A controller for getting and showing the data.
app.controller('show_data_ctrl', function ($scope, $http) {
    $scope.loading = true;
    $http.get(sectraAPI).then(function (response) {
        // Create a new array with patients, the "key" is the patient´s name
        var the_patients = new Array();
        var size = response.data.Result.length;

        // Loop though the json´s Result tag
        for (var i = 0; i < size; i++) {
            // What should we do about txtfiles??? They do not have a "name".
            if (response.data.Result[i].Type == "dicom") {
                // Get the name from the dicom tag
                var name = response.data.Result[i].Document["(0010,0010)"];
                // Check if the name is already in the patient array, returns the index, 
                // if not found it returns -1.
                var index = the_patients.findIndex(x => x.name == name);

                // If the name is not in the array, add it. 
                if (index == -1) {
                    // the_objects is the array with all the files from the same patient.
                    var the_objects = new Array();
                    the_patients.push({
                        "name": name,
                        "objects": the_objects
                    })
                    index = the_patients.length - 1;
                }
                // Add the file to the patient´s object array
                (the_patients[index].objects).push(response.data.Result[i]);
            }

        }

        /* Just for checking that the patient array is the way it should be, could be deleted.
        for(var i = 0; i < the_patients.length; i++){
            for(var j = 0; j < the_patients[i].objects.length; j++)
            console.log(the_patients[i].objects[j].Type);
        }*/

        // To keep the object array as a "global" array.
        show_data_array = the_patients;

        // "Returns" the patient array, the data will be stored in the variable "show_data"
        $scope.show_data = the_patients;

    }).finally(function () {
        $scope.loading = false;
    });



    /** FOR SORTING THE TABLE **/
    $scope.property_name = 'name';
    $scope.reverse = true;

    $scope.sortBy = function (property_name) {
        $scope.reverse = ($scope.property_name === property_name) ? !$scope.reverse : false;
        $scope.property_name = property_name;
    };

    /***************************/

    /** FOR EXPANDING THE LIST **/
    $scope.xExpand = function (x, parent) {
        x.expanded = !x.expanded;
        if (!x.expanded && parent) collapseAll(x);
    }
    function collapseAll(x) {
        for (var i = 0; i < x.objects.length; i++) {
            x.objects[i].expanded = false;
        }
    }
/*    sätter maxgräns för antal visade objekt, används inte för tillfället
    var limitStep = 5;
    $scope.limit = 20;

    $scope.incrementLimit = function () {
        $scope.limit += limitStep;
    };
    $scope.decrementLimit = function () {
        $scope.limit -= limitStep;
    };
*/
    /****************************/
    $scope.fullFilter = [
        { key: '(0008,0005)', name: 'SpecificCharacterSet' },
        //     { key: '(0008,0008))', name: 'ImageType' },                          BORTKOMMENTERADE RADER ÄR arrays/object behöver ny funktion för dem antar jag
        { key: '(0008,0012)', name: 'InstanceCreationDate' },
        { key: '(0008,0013)', name: 'InstanceCreationTime' },
        { key: '(0008,0016)', name: 'SOPClassUID' },
        { key: '(0008,0018)', name: 'SOPInstanceUID' },
        { key: '(0008,0020)', name: 'StudyDate' },
        { key: '(0008,0022)', name: 'AcquisitionDate' },
        { key: '(0008,0030)', name: 'StudyTime' },
        { key: '(0008,0032)', name: 'AcquisitionTime' },
        { key: '(0008,0050)', name: 'AccessionNumber' },
        { key: '(0008,0060)', name: 'Modality' },
        { key: '(0008,0070)', name: 'Manufacturer' },
        { key: '(0008,0080)', name: 'InstitutionName' },
        { key: '(0008,0090)', name: 'ReferringPhysicianName' },
        { key: '(0008,1010)', name: 'StationName' },
        { key: '(0008,1030)', name: 'StudyDescription' },
        { key: '(0008,103E)', name: 'SeriesDescription' },
        { key: '(0008,1040)', name: 'InstitutionalDepartmentName' },
        { key: '(0008,1050)', name: 'PerformingPhysicianName' },
        { key: '(0008,1060)', name: 'NameOfPhysicianReadingStudy' },
        { key: '(0008,1090)', name: 'ManufacturersModelName' },
        { key: '(0010,0010)', name: 'PatientName' },
        { key: '(0010,0020)', name: 'PatientID' },
        { key: '(0010,0030)', name: 'PatientBirthDate' },
        { key: '(0010,0040)', name: 'PatientSex' },
        { key: '(0018,1000)', name: 'DeviceSerialNumber' },
        { key: '(0018,1004)', name: 'PlateID' },
        { key: '(0018,1020)', name: 'SoftwareVersion' },
        //   { key: '(0018,1164)', name:'ImagerPixelSpacing'},
        { key: '(0018,1260)', name: 'PlateType' },
        { key: '(0018,1401)', name: 'AcquisitionDeviceProcessingCode' },
        { key: '(0018,1402)', name: 'CassetteOrientation' },
        { key: '(0018,1403)', name: 'CassetteSize' },
        { key: '(0018,1404)', name: 'ExposuresOnPlate' },
        { key: '(0018,5101)', name: 'ViewPosition' },
        { key: '(0018,6000)', name: 'Sensitivity' },
        { key: '(0020,000D)', name: 'StudyInstanceUID' },
        { key: '(0020,000E)', name: 'SeriesInstanceUID' },
        { key: '(0020,0010)', name: 'StudyID' },
        { key: '(0020,0011)', name: 'SeriesNumber' },
        { key: '(0020,0013)', name: 'InstanceNumber' },
        { key: '(0020,1002)', name: 'ImagesInAcquisition' },
        { key: '(0028,0002)', name: 'SamplesPerPixel' },
        { key: '(0028,0004)', name: 'PhotometricInterpretation' },
        { key: '(0028,0010)', name: 'Rows' },
        { key: '(0028,0011)', name: 'Columns' },
        //    { key: '(0028,0030)', name:'PixelSpacing'},
        { key: '(0028,0100)', name: 'BitsAllocated' },
        { key: '(0028,0101)', name: 'BitsStored' },
        { key: '(0028,0102)', name: 'HighBit' },
        { key: '(0028,0103)', name: 'PixelRepresentation(0=unsigned, 1=signed)' },
        { key: '(0028,1052)', name: 'RescaleIntercept' },
        { key: '(0028,1053)', name: 'RescaleSlope' },
        { key: '(0028,1054)', name: 'RescaleType' },
        //       { key: '(0028,3010)', name:'VOILUTSequence'},
        //      { key: '(0028,3002)', name:'LUTDescriptor'},
        //      { key: '(0028,3003)', name:'LUTExplanation'},
        //     { key: '(0028,3006)', name:'LUTData'},
        { key: '(0032,000A)', name: 'StudyStatusID' },
        //      { key: '(7FE0,0010)', name:'PixelData'},
        //      { key: '(0002,0000)', name:'FileMetaInfoGroupLength'},
        //       { key: '(0002,0001)', name:'FileMetaInfoVersion'},
        //     { key: '(0002,0002)', name:'MediaStorageSOPClassUID'},
        //      { key: '(0002,0003)', name:'MediaStorageSOPInstanceUID'},
        //      { key: '(0002,0010)', name:'TransferSyntaxUID'},
        //      { key: '(0002,0012)', name:'ImplementationClassUID'}
    ];
    $scope.selectedFilter = [];

    $scope.toggleFilter = function toggleFilter(p) {
        var idx = $scope.selectedFilter.map(function (e) { return e.key }).indexOf(p.key)
        if (idx > -1) {
            $scope.selectedFilter.splice(idx, 1);
        } else {
            $scope.selectedFilter.push({ key: p.key, name: p.name });
        }
    }

    $scope.checkBoxFilter = function (item) {

        if ($scope.search_filter == undefined) {
            return true;
        } else if (!$scope.selectedFilter.length) {
            for (var i = 0; i < $scope.fullFilter.length; i++) {
                var p = item.Document[$scope.fullFilter[i].key];
                if (p) {
                    if (p.toString().toLowerCase().indexOf($scope.search_filter.toLowerCase()) != -1)
                        return true;
                }
            }
        } else if ($scope.selectedFilter.length) {
            for (var i = 0; i < $scope.selectedFilter.length; i++) {
                var p = item.Document[$scope.selectedFilter[i].key];
                if (p) {
                    if (p.toString().toLowerCase().indexOf($scope.search_filter.toLowerCase()) != -1)
                        return true;
                }
            }

        }
        return false;
    };


});
