## Develop and Run

Instructions for running the server:
```bash
1. Install node.js

2. Navigate to the directory where server.js is located

3. Shift + Right click and press "open command window here"

3.5 If it is the first time running, type "npm install"

4. To start the server type: "node server.js"

5. You will now see that the server is running on localhost:8080,
navigate to a browser and enter that same adress.

````



## What

This is a project created for Sectra. On the web application the user can browse through files located at a database supplied to the developers. This can be done on the home page and the Search page. The user can sort and filter the results based on the user's needs.

On the Add Files page, the user can uppload files to the database. Before the user can upload files to the database through the application, the user has to place the files locally in the folder \\teatime.westeurope.cloudapp.azure.com\SharedStorage. Then the user can upload a selected folder, placed in \\teatime.westeurope.cloudapp.azure.com\SharedStorage, to the database through the application. The user can enter information about the files to be added through the form on the page. The information entered will be saved in a json file that will be placed in the folder to be imported. On the page, there is a possibility to add custom fields with additional information about the files. The information the user enters in these fields has not been fully developed yet and is unfortunately not connected to the json file. Therefore, this information will not be imported with the files.

The search page shows a table with all the testdata in the database. The user can search for specific tags and sort the table by patient name. When it comes to the testdata the user is able to delete it (removes it from the database) or edit it. The function to edit the testdata is not yet fully functioning since the API does not yet support the action. The user can also drag testdata to the drag and drop target on the sidebar. It is possible to drag a testdata alone by dragging the id or all the testdata for a patient by dragging the name of the patient (the patient has to be expanded, otherwise it does not find the testdata inside).

The test page shows the testdata that has been dragged into the drag and drop field in a table. Overall information is shown and the user can either remove testdata from the table (does not remove it from the database) or send it to test. The function to send it to test is not yet implemented.
