// The URL for getting the testdata.
var sectraAPI = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/TestData?q=*&from=0&size=1000";

// Create an array that will contain the objects read from the database.
var show_data_array = new Array();

// A controller for getting and showing the data.
app.controller('show_data_ctrl', function ($scope, $http, $mdDialog) {

  /***********************************************************/
  /****************** GET DATA FROM API **********************/
  /***********************************************************/

  $scope.loading = true; // Makes the loading animation visible

  $http.get(sectraAPI).then(function (response) { // GET request to the API
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
          var the_modalities = new Array();
          var the_tags = new Array();

          the_patients.push({
            "name": name,
            "objects": the_objects,
            "modalities": the_modalities,
            "tags": the_tags
          })
          index = the_patients.length - 1;
        }
        // Add the file to the patient´s object array
        (the_patients[index].objects).push(response.data.Result[i]);

        // Add the modality of the file if it is not already in modalitites.
        var modality_exists_already = false;
        for (var j = 0; j < the_patients[index].modalities.length; j++) {
          if (the_patients[index].modalities[j] == response.data.Result[i].Document["(0008,0060)"]) {
            modality_exists_already = true;
          }
        }
        if (!modality_exists_already) {
          (the_patients[index].modalities).push(response.data.Result[i].Document["(0008,0060)"]);
        }

        // Add the tags if they do not already exist in tags //
        var tag_exists_already = false;
        for (var k = 0; k < response.data.Result[i].Document["Attributes"]["Tags"].length; k++) {
          for (var j = 0; j < the_patients[index].tags.length; j++) {
            if (the_patients[index].tags[j] == response.data.Result[i].Document["Attributes"]["Tags"][k]) {
              tag_exists_already = true;
            }
          }
          if (!tag_exists_already) {
            (the_patients[index].tags).push(response.data.Result[i].Document["Attributes"]["Tags"][k]);
          }
          else {
            tag_exists_already = false;
          }
        }
      }
    }

    // To keep the object array as a "global" array.
    show_data_array = the_patients;

    // "Returns" the patient array, the data will be stored in the variable "show_data"
    $scope.show_data = the_patients;
    $scope.show_data_length = the_patients.length;

  })
    .finally(function () {
      $scope.loading = false; // Makes the loading animation invisible
    });

  /**********************************************************/
  /****************** FOR SORTING THE TABLE *****************/
  /**********************************************************/

  $scope.property_name = 'name';
  $scope.reverse = true;

  $scope.sortBy = function (property_name) {
    $scope.reverse = ($scope.property_name === property_name) ? !$scope.reverse : false;
    $scope.property_name = property_name;
  };

  /***********************************************************/
  /**************** FOR EXPANDING THE LIST *******************/
  /***********************************************************/

  $scope.xExpand = function (x, parent) {
    x.expanded = !x.expanded;
    if (!x.expanded && parent) collapseAll(x);
  }
  function collapseAll(x) {
    for (var i = 0; i < x.objects.length; i++) {
      x.objects[i].expanded = false;
    }
  }

  /**********************************************************/
  /*************** DELETE AN ENTRYITEM **********************/
  /**********************************************************/

  // Delete function, this part deletes an ENTRYITEM, in values are objectID and objectType, objectID is the id to be removed, objectType is
  // the type like dicom  
  $scope.deleteEntryItem = function (ev, objectID, objectType) {
    var confirm = $mdDialog.confirm()
      .title('Delete Entry')
      .textContent('Are you sure you want do delete the entry item with ID: ' + objectID + ", of the type: " + objectType)
      .ariaLabel('Close')
      .targetEvent(ev)
      .ok('Yes')
      .cancel('No');

    // Upon confirming the delete request will be sent.
    $mdDialog.show(confirm).then(function () {
      console.log("http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/TestData/BulkDelete/" + objectType + "?purge=true", [objectID]);
      $http({
        method: 'DELETE',
        url: 'http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/TestData/BulkDelete/' + objectType + '?purge=true',
        data: [objectID],
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        }
      })
        .success(function (data, status, headers) {
          console.log(data);
          var row = document.getElementById(objectID);
          row.style.display = "none";
        })
    })
  }

  function DialogController($scope, $mdDialog) {
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
      $mdDialog.hide(answer);
    };
  };


  /***************************************************************************/
  /******************************** EDIT DATA ********************************/
  /***************************************************************************/

  // The ID of the testdata that has been chosen to edit
  var the_edit_ID;

  // Function for setting the initial values in the edit modal for the chosen testdata.
  $scope.editInitData = function (obj) {
    var the_object = obj;
    the_edit_ID = the_object.Id;

    // Sets the value of the input fields to the values the already have.
    $('#edit-creator').val(the_object.Document["Attributes"]["Info"]["Creator"]);
    $('#edit-TDID').val(the_object.Document["Attributes"]["Info"]["TestDataID"]);
    $('#edit-TCID').val(the_object.Document["Attributes"]["Info"]["TestCaseID"]);
    $('#edit-patient-name').val(the_object.Document["Attributes"]["Info"]["NewPatientName"]);
    $('#edit-tags').val(the_object.Document["Attributes"]["Tags"]);
    $('#edit-description').val(the_object.Document["Attributes"]["Info"]["Description"]);
    if (the_object.Document["Attributes"]["Info"]["Anonymized"] == "true")
      document.getElementById("edit-anonymize").checked = true;
    else
      document.getElementById("edit-anonymize").checked = false;
  };


  // Function that edits the data written by the user.
  $scope.editDataFunction = function () {
    // Get the values from the input fields
    var new_creator = $('#edit-creator').val();
    var new_TDID = $('#edit-TDID').val();
    var new_TCID = $('#edit-TCID').val();
    var new_patient_name = $('#edit-patient-name').val();
    var new_tags = $('#edit-tags').val();
    var new_description = $('#edit-description').val();
    if ($('#edit-anonymize').val() == "on")
      var new_anonymized = true;
    else
      var new_anonymized = false;

    // RequestURL for getting the entry for the testdata
    var getEntryURL = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Search/Entries?q=" + the_edit_ID + "&from=0&size=1";

    // GET request for getting the entry
    $http.get(getEntryURL).then(function (response) {
      var testDataEntryID = response.data.Result[0].Id;
      var RootDirectory = response.data.Result[0].RootDirectory;
      var DocIdsToPaths = response.data.Result[0].DocIdsToPaths;
      var ImportDate = response.data.Result[0].Info["Import Date"];

      // Create the testdataentry for the PUT request
      var testDataEntry = {
        "Id": testDataEntryID,
        "RootDirectory": RootDirectory,
        "DocIdsToPaths": DocIdsToPaths,
        "Info": {
          "Import Date": ImportDate,
          "Anonymized": new_anonymized,
          "Creator": new_creator,
          "TestDataID": new_TDID,
          "TestCaseID": new_TCID,
          "NewPatientName": new_patient_name,
          "Description": new_description
        },
        "Tags": new_tags.split(","),
        "Status": 2,
        "StatusMessage": ""
      }

      // RequestURL for the PUT request
      var requestURL = "http://teatime.westeurope.cloudapp.azure.com/teatimewebapi/api/v0/Entries/" + testDataEntryID;

      /*
      // PUT request for updating the entry (and thereby also the testdata) 
      // {{ NOTE: the PUT function in the API does not work yet }}
      $http({
        method  : 'PUT',
        url     : requestURL,
        data    : testDataEntry,
        headers: {
        "Content-type": "application/json",
        "Accept" : "application/json"
        } 
      }).success(function(data, status, headers) {
            console.log(data);
            console.log("status: " + status);
      });
      */
    });
  };
  $scope.toggleFilter = function toggleFilter(p) {
    var idx = $scope.selectedFilter.map(function (e) { return e.key }).indexOf(p.key)
    if (idx > -1) {
      $scope.selectedFilter.splice(idx, 1);
    } else {
      $scope.selectedFilter.push({ key: p.key, name: p.name });
    }
  };

  $scope.checkBoxFilter = function (item) {
    if ($scope.search_filter == undefined || !$scope.search_filter || !$scope.selectedFilter.length) {
      return true;
    } else {
      for (var i = 0; i < $scope.selectedFilter.length; i++) {
        if (!$scope.selectedFilter[i].id) {
          var p = item[$scope.selectedFilter[i].key];
        } else if ($scope.selectedFilter[i].id == "Document") {
          var p = item.Document[$scope.selectedFilter[i].key];
        } else if ($scope.selectedFilter[i].id == "Info") {
          var p = item["Document"]["Attributes"]["Info"][$scope.selectedFilter[i].key];
        } else if ($scope.selectedFilter[i].id == "Tags") {
          var p = item["Document"]["Attributes"][$scope.selectedFilter[i].key];
        } else {
          var p = item["Document"][$scope.selectedFilter[i].id][$scope.selectedFilter[i].key];
        }
        if (p != undefined) {
          return $scope.fileContains(p);
        }
      }
    }
    return false;
  };
  $scope.fileContains = function (p) {
    if (Array.isArray(p)) {
      for (var i = 0; i < p.length; i++) {
        if (p[i].toString().toLowerCase().indexOf($scope.search_filter.toLowerCase()) != -1)
          return true;
      }
    } else {
      if (p.toString().toLowerCase().indexOf($scope.search_filter.toLowerCase()) != -1)
        return true;
    }
    return false;
  };
  $scope.removeParent = function (item) {
    for (var i = 0; i < item.objects.length; i++) {
      if ($scope.checkBoxFilter(item.objects[i]))
        return true;
    }
    return false;
  };
  $scope.fullFilter = [
    { key: 'Id', name: 'Id', id: '' },
    { key: 'Type', name: 'Type', id: '' },
    { key: 'FileSize', name: 'FileSize', id: "FileMeta" },
    { key: 'Extension', name: 'Extension', id: "FileMeta" },
    { key: 'CreationTime', name: 'CreationTime', id: "FileMeta" },
    { key: 'WriteTime', name: 'WriteTime', id: "FileMeta" },
    { key: 'Path', name: 'Path', id: "FileMeta" },
    { key: 'Import Date', name: 'Import Date', id: "Info" },
    { key: 'Anonymized', name: 'Anonymized', id: "Info" },
    { key: 'Creator', name: 'Creator', id: "Info" },
    { key: 'NewPatientName', name: 'NewPatientName', id: "Info" },
    { key: 'Tags', name: 'Tags', id: "Tags" },
    //-----------------------------------
    { key: '(0008,0005)', name: 'SpecificCharacterSet', id: "Document" },
    //     { key: '(0008,0008))', name: 'ImageType' , id:"Document"},                          BORTKOMMENTERADE RADER ÄR arrays/object behöver ny funktion för dem antar jag
    { key: '(0008,0012)', name: 'InstanceCreationDate', id: "Document" },
    { key: '(0008,0013)', name: 'InstanceCreationTime', id: "Document" },
    { key: '(0008,0016)', name: 'SOPClassUID', id: "Document" },
    { key: '(0008,0018)', name: 'SOPInstanceUID', id: "Document" },
    { key: '(0008,0020)', name: 'StudyDate', id: "Document" },
    { key: '(0008,0022)', name: 'AcquisitionDate', id: "Document" },
    { key: '(0008,0030)', name: 'StudyTime', id: "Document" },
    { key: '(0008,0032)', name: 'AcquisitionTime', id: "Document" },
    { key: '(0008,0050)', name: 'AccessionNumber', id: "Document" },
    { key: '(0008,0060)', name: 'Modality', id: "Document" },
    { key: '(0008,0070)', name: 'Manufacturer', id: "Document" },
    { key: '(0008,0080)', name: 'InstitutionName', id: "Document" },
    { key: '(0008,0090)', name: 'ReferringPhysicianName', id: "Document" },
    { key: '(0008,1010)', name: 'StationName', id: "Document" },
    { key: '(0008,1030)', name: 'StudyDescription', id: "Document" },
    { key: '(0008,103E)', name: 'SeriesDescription', id: "Document" },
    { key: '(0008,1040)', name: 'InstitutionalDepartmentName', id: "Document" },
    { key: '(0008,1050)', name: 'PerformingPhysicianName', id: "Document" },
    { key: '(0008,1060)', name: 'NameOfPhysicianReadingStudy', id: "Document" },
    { key: '(0008,1090)', name: 'ManufacturersModelName', id: "Document" },
    { key: '(0010,0010)', name: 'PatientName', id: "Document" },
    { key: '(0010,0020)', name: 'PatientID', id: "Document" },
    { key: '(0010,0030)', name: 'PatientBirthDate', id: "Document" },
    { key: '(0010,0040)', name: 'PatientSex', id: "Document" },
    { key: '(0018,1000)', name: 'DeviceSerialNumber', id: "Document" },
    { key: '(0018,1004)', name: 'PlateID', id: "Document" },
    { key: '(0018,1020)', name: 'SoftwareVersion', id: "Document" },
    //   { key: '(0018,1164)', name:'ImagerPixelSpacing', id:"Document"},
    { key: '(0018,1260)', name: 'PlateType', id: "Document" },
    { key: '(0018,1401)', name: 'AcquisitionDeviceProcessingCode', id: "Document" },
    { key: '(0018,1402)', name: 'CassetteOrientation', id: "Document" },
    { key: '(0018,1403)', name: 'CassetteSize', id: "Document" },
    { key: '(0018,1404)', name: 'ExposuresOnPlate', id: "Document" },
    { key: '(0018,5101)', name: 'ViewPosition', id: "Document" },
    { key: '(0018,6000)', name: 'Sensitivity', id: "Document" },
    { key: '(0020,000D)', name: 'StudyInstanceUID', id: "Document" },
    { key: '(0020,000E)', name: 'SeriesInstanceUID', id: "Document" },
    { key: '(0020,0010)', name: 'StudyID', id: "Document" },
    { key: '(0020,0011)', name: 'SeriesNumber', id: "Document" },
    { key: '(0020,0013)', name: 'InstanceNumber', id: "Document" },
    { key: '(0020,1002)', name: 'ImagesInAcquisition', id: "Document" },
    { key: '(0028,0002)', name: 'SamplesPerPixel', id: "Document" },
    { key: '(0028,0004)', name: 'PhotometricInterpretation', id: "Document" },
    { key: '(0028,0010)', name: 'Rows', id: "Document" },
    { key: '(0028,0011)', name: 'Columns', id: "Document" },
    //    { key: '(0028,0030)', name:'PixelSpacing', id:48},
    { key: '(0028,0100)', name: 'BitsAllocated', id: "Document" },
    { key: '(0028,0101)', name: 'BitsStored', id: "Document" },
    { key: '(0028,0102)', name: 'HighBit', id: "Document" },
    { key: '(0028,0103)', name: 'PixelRepresentation(0=unsigned, 1=signed)', id: "Document" },
    { key: '(0028,1052)', name: 'RescaleIntercept', id: "Document" },
    { key: '(0028,1053)', name: 'RescaleSlope', id: "Document" },
    { key: '(0028,1054)', name: 'RescaleType', id: "Document" },
    //       { key: '(0028,3010)', name:'VOILUTSequence', id:56},
    //      { key: '(0028,3002)', name:'LUTDescriptor', id:57},
    //      { key: '(0028,3003)', name:'LUTExplanation', id:58},
    //     { key: '(0028,3006)', name:'LUTData', id:59},
    { key: '(0032,000A)', name: 'StudyStatusID', id: "Document" },
    //      { key: '(7FE0,0010)', name:'PixelData', id:61},
    //      { key: '(0002,0000)', name:'FileMetaInfoGroupLength', id:62},
    //       { key: '(0002,0001)', name:'FileMetaInfoVersion', id:63},
    //     { key: '(0002,0002)', name:'MediaStorageSOPClassUID', id:64},
    //      { key: '(0002,0003)', name:'MediaStorageSOPInstanceUID', id:65},
    //      { key: '(0002,0010)', name:'TransferSyntaxUID', id:66},
    //      { key: '(0002,0012)', name:'ImplementationClassUID', id:67}


  ];
  $scope.selectedFilter = [];


  $scope.ddsettings = {
    scrollable: true,
    enableSearch: true,
    showCheckAll: false,
    externalIdProp: '',
  };

});

app.directive('ngDropdownMultiselect', ['$filter', '$document', '$compile', '$parse',

  function ($filter, $document, $compile, $parse) {

    return {
      restrict: 'AE',
      scope: {
        selectedModel: '=',
        options: '=',
        extraSettings: '=',
        events: '=',
        searchFilter: '=?',
        translationTexts: '=',
        groupBy: '@'
      },
      template: function (element, attrs) {
        var checkboxes = attrs.checkboxes ? true : false;
        var groups = attrs.groupBy ? true : false;

        var template = '<div class="multiselect-parent btn-group dropdown-multiselect">';
        template += '<button type="button" class="dropdown-toggle" ng-class="settings.buttonClasses" ng-click="toggleDropdown()">{{getButtonText()}}&nbsp;<span class="caret"></span></button>';
        template += '<ul class="dropdown-menu dropdown-menu-form" ng-style="{display: open ? \'block\' : \'none\', height : settings.scrollable ? settings.scrollableHeight : \'auto\' }" style="overflow: scroll" >';
        template += '<li ng-hide="!settings.showCheckAll || settings.selectionLimit > 0"><a data-ng-click="selectAll()"><span class="glyphicon glyphicon-ok"></span>  {{texts.checkAll}}</a>';
        template += '<li ng-show="settings.showUncheckAll"><a data-ng-click="deselectAll();"><span class="glyphicon glyphicon-remove"></span>   {{texts.uncheckAll}}</a></li>';
        template += '<li ng-hide="(!settings.showCheckAll || settings.selectionLimit > 0) && !settings.showUncheckAll" class="divider"></li>';
        template += '<li ng-show="settings.enableSearch"><div class="dropdown-header"><input type="text" class="form-control" style="width: 100%;" ng-model="searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>';
        template += '<li ng-show="settings.enableSearch" class="divider"></li>';

        if (groups) {
          template += '<li ng-repeat-start="option in orderedItems | filter: searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupTitle(getPropertyForObject(option, settings.groupBy)) }}</li>';
          template += '<li ng-repeat-end role="presentation">';
        } else {
          template += '<li role="presentation" ng-repeat="option in options | filter: searchFilter">';
        }

        template += '<a role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))">';

        if (checkboxes) {
          template += '<div class="checkbox"><label><input class="checkboxInput" type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /> {{getPropertyForObject(option, settings.displayProp)}}</label></div></a>';
        } else {
          template += '<span data-ng-class="{\'glyphicon glyphicon-ok\': isChecked(getPropertyForObject(option,settings.idProp))}"></span> {{getPropertyForObject(option, settings.displayProp)}}</a>';
        }

        template += '</li>';

        template += '<li class="divider" ng-show="settings.selectionLimit > 1"></li>';
        template += '<li role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>';

        template += '</ul>';
        template += '</div>';

        element.html(template);
      },
      link: function ($scope, $element, $attrs) {
        var $dropdownTrigger = $element.children()[0];

        $scope.toggleDropdown = function () {
          $scope.open = !$scope.open;
        };

        $scope.checkboxClick = function ($event, id) {
          $scope.setSelectedItem(id);
          $event.stopImmediatePropagation();
        };

        $scope.externalEvents = {
          onItemSelect: angular.noop,
          onItemDeselect: angular.noop,
          onSelectAll: angular.noop,
          onDeselectAll: angular.noop,
          onInitDone: angular.noop,
          onMaxSelectionReached: angular.noop
        };

        $scope.settings = {
          dynamicTitle: true,
          scrollable: false,
          scrollableHeight: '300px',
          closeOnBlur: true,
          displayProp: 'name',
          idProp: 'key',
          externalIdProp: 'key',
          enableSearch: false,
          selectionLimit: 0,
          showCheckAll: true,
          showUncheckAll: true,
          closeOnSelect: false,
          buttonClasses: 'btn btn-default',
          closeOnDeselect: false,
          groupBy: $attrs.groupBy || undefined,
          groupByTextProvider: null,
          smartButtonMaxItems: 0,
          smartButtonTextConverter: angular.noop
        };

        $scope.texts = {
          checkAll: 'Check All',
          uncheckAll: 'Uncheck All',
          selectionCount: 'checked',
          selectionOf: '/',
          searchPlaceholder: 'Search on specific field...',
          buttonDefaultText: 'Advanced Search',
          dynamicButtonTextSuffix: 'checked'
        };

        $scope.searchFilter = $scope.searchFilter || '';

        if (angular.isDefined($scope.settings.groupBy)) {
          $scope.$watch('options', function (newValue) {
            if (angular.isDefined(newValue)) {
              $scope.orderedItems = $filter('orderBy')(newValue, $scope.settings.groupBy);
            }
          });
        }

        angular.extend($scope.settings, $scope.extraSettings || []);
        angular.extend($scope.externalEvents, $scope.events || []);
        angular.extend($scope.texts, $scope.translationTexts);

        $scope.singleSelection = $scope.settings.selectionLimit === 1;

        function getFindObj(id) {
          var findObj = {};

          if ($scope.settings.externalIdProp === '') {
            findObj[$scope.settings.idProp] = id;
          } else {
            findObj[$scope.settings.externalIdProp] = id;
          }

          return findObj;
        }

        function clearObject(object) {
          for (var prop in object) {
            delete object[prop];
          }
        }

        if ($scope.singleSelection) {
          if (angular.isArray($scope.selectedModel) && $scope.selectedModel.length === 0) {
            clearObject($scope.selectedModel);
          }
        }

        if ($scope.settings.closeOnBlur) {
          $document.on('click', function (e) {
            var target = e.target.parentElement;
            var parentFound = false;

            while (angular.isDefined(target) && target !== null && !parentFound) {
              if (_.includes(target.className.split(' '), 'multiselect-parent') && !parentFound) {
                if (target === $dropdownTrigger) {
                  parentFound = true;
                }
              }
              target = target.parentElement;
            }

            if (!parentFound) {
              $scope.$apply(function () {
                $scope.open = false;
              });
            }
          });
        }

        $scope.getGroupTitle = function (groupValue) {
          console.log("hej")
          if ($scope.settings.groupByTextProvider !== null) {
            return $scope.settings.groupByTextProvider(groupValue);
          }

          return groupValue;
        };

        $scope.getButtonText = function () {
          if ($scope.settings.dynamicTitle && ($scope.selectedModel.length > 0 || (angular.isObject($scope.selectedModel) && _.keys($scope.selectedModel).length > 0))) {
            if ($scope.settings.smartButtonMaxItems > 0) {
              var itemsText = [];

              angular.forEach($scope.options, function (optionItem) {
                if ($scope.isChecked($scope.getPropertyForObject(optionItem, $scope.settings.idProp))) {
                  var displayText = $scope.getPropertyForObject(optionItem, $scope.settings.displayProp);
                  var converterResponse = $scope.settings.smartButtonTextConverter(displayText, optionItem);

                  itemsText.push(converterResponse ? converterResponse : displayText);
                }
              });

              if ($scope.selectedModel.length > $scope.settings.smartButtonMaxItems) {
                itemsText = itemsText.slice(0, $scope.settings.smartButtonMaxItems);
                itemsText.push('...');
              }

              return itemsText.join(', ');
            } else {
              var totalSelected;

              if ($scope.singleSelection) {
                totalSelected = ($scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp])) ? 1 : 0;
              } else {
                totalSelected = angular.isDefined($scope.selectedModel) ? $scope.selectedModel.length : 0;
              }

              if (totalSelected === 0) {
                return $scope.texts.buttonDefaultText;
              } else {
                return totalSelected + ' ' + $scope.texts.dynamicButtonTextSuffix;
              }
            }
          } else {
            return $scope.texts.buttonDefaultText;
          }
        };

        $scope.getPropertyForObject = function (object, property) {
          if (angular.isDefined(object) && object.hasOwnProperty(property)) {
            return object[property];
          }

          return '';
        };

        $scope.selectAll = function () {
          $scope.deselectAll(false);
          $scope.externalEvents.onSelectAll();

          angular.forEach($scope.options, function (value) {
            $scope.setSelectedItem(value[$scope.settings.idProp], true);
          });
        };

        $scope.deselectAll = function (sendEvent) {
          sendEvent = sendEvent || true;

          if (sendEvent) {
            $scope.externalEvents.onDeselectAll();
          }

          if ($scope.singleSelection) {
            clearObject($scope.selectedModel);
          } else {
            $scope.selectedModel.splice(0, $scope.selectedModel.length);
          }
        };

        $scope.setSelectedItem = function (id, dontRemove) {
          var findObj = getFindObj(id);
          var finalObj = null;

          if ($scope.settings.externalIdProp === '') {
            finalObj = _.find($scope.options, findObj);
          } else {
            finalObj = findObj;
          }

          if ($scope.singleSelection) {
            clearObject($scope.selectedModel);
            angular.extend($scope.selectedModel, finalObj);
            $scope.externalEvents.onItemSelect(finalObj);
            if ($scope.settings.closeOnSelect) $scope.open = false;

            return;
          }

          dontRemove = dontRemove || false;

          var exists = _.findIndex($scope.selectedModel, findObj) !== -1;

          if (!dontRemove && exists) {
            $scope.selectedModel.splice(_.findIndex($scope.selectedModel, findObj), 1);
            $scope.externalEvents.onItemDeselect(findObj);
          } else if (!exists && ($scope.settings.selectionLimit === 0 || $scope.selectedModel.length < $scope.settings.selectionLimit)) {
            $scope.selectedModel.push(finalObj);
            $scope.externalEvents.onItemSelect(finalObj);
          }
          if ($scope.settings.closeOnSelect) $scope.open = false;
        };

        $scope.isChecked = function (id) {
          if ($scope.singleSelection) {
            return $scope.selectedModel !== null && angular.isDefined($scope.selectedModel[$scope.settings.idProp]) && $scope.selectedModel[$scope.settings.idProp] === getFindObj(id)[$scope.settings.idProp];
          }

          return _.findIndex($scope.selectedModel, getFindObj(id)) !== -1;
        };

        $scope.externalEvents.onInitDone();
      }
    };
  }]);