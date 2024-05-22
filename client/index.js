// Event listener for when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {

    //Initiates an HTTP request to the specified URL (http://localhost:5000/getAll).
    //This is an asynchronous operation that fetches data from the server.
    //Chains a promise handler to the fetch operation. 
    //When the HTTP response is received, this function converts the response body to JSON format.
    //response.json() returns a promise that resolves with the JSON data parsed from the response body.
    //Chains another promise handler to the previous one. It receives the parsed JSON data as an argument (data).
    //Calls the LoadHTMLTable function and passes the 'data' property of the parsed JSON data as an argument.
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data => LoadHTMLTable(data['data']));
    
});

// Event listener for clicks on the table body
document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

searchBtn.onclick = function() {
    const searchValue = document.querySelector('#search-input').value;

    fetch('http://localhost:5000/search/' + searchValue)
    .then(response => response.json())
    .then(data => LoadHTMLTable(data['data']));
}

function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })

    //The response body is parsed as JSON.
    //The parsed JSON data is then checked. 
    //If the success property in the returned data is true, 
    //the page is reloaded using location.reload(). 
    //This likely indicates that the update was successful and the user interface needs to be updated to reflect the changes.
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    });
}


function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-name-input').dataset.id = id;
}

//This assigns a function to the onclick event handler of the updateBtn button. 
//The function will execute when the button is clicked.
updateBtn.onclick = function() {

    //This line selects the input element with the ID update-name-input
    const updatedNameInput = document.querySelector('#update-name-input');

//This initiates a PATCH request to http://localhost:5000/update.
// It sets the request header Content-type to application/json, indicating that the request body is in JSON format.
// The HTTP method used is PATCH, which is commonly used for updating existing resources on the server.
// The request body is constructed using JSON.stringify() 
//to convert an object containing the id and name properties into a JSON string. 
//The id is retrieved from the dataset property of the updatedNameInput, while the name is retrieved from its value property.

    fetch('http://localhost:5000/update', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            id: updatedNameInput.dataset.id,
            name: updatedNameInput.value

        })
    })

    //The response body is parsed as JSON.
    //The parsed JSON data is then checked. 
    //If the success property in the returned data is true, 
    //the page is reloaded using location.reload(). 
    //This likely indicates that the update was successful and the user interface needs to be updated to reflect the changes.
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    });
}

//Selects the HTML button element with the ID add-name-btn.
const addBtn = document.querySelector('#add-name-btn');

//Assigns a function to the onclick event handler of the addBtn button. 
//This function will be executed when the button is clicked.
addBtn.onclick = function () {

    //Retrieves the value entered in an input field with the ID name-input.
    // This input field is likely used to input a new name.
    //Stores the value in the name variable.
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    
    //Clears the input field after retrieving its value. 
    //This ensures that the input field is ready for the next entry.
    nameInput.value = "";

    //Initiates a POST request to http://localhost:5000/insert with the following configurations:
    // Sets the request header Content-type to application/json.
    // Uses the HTTP method POST.
    // Provides the request body as a JSON string containing the new name (name).
    fetch('http://localhost:5000/insert', {
        headers: {
            //When a server receives a request with the 'Content-type' header set to 'application/json',
            // it knows to expect JSON data in the request body. 
            // This allows the server to parse the incoming JSON data 
            // and extract the information it needs to process the request.
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name : name})
    })

    //Chains promise resolution handlers to the fetch operation. 
    //When the response is received from the server, response body is parsed as JSON.
    //The parsed JSON data is passed to the InsertRowIntoTable function
    .then(response => response.json())
    .then(data => InsertRowIntoTable(data['data']));
}


// Function to insert a new row into the HTML table
function InsertRowIntoTable(data) {

    console.log(data);

    //Selects the <tbody> element of a table in the HTML document. This is where the new row will be inserted.
    const table = document.querySelector('table tbody');

    //Checks if there is any existing data in the table by querying for an element with the class .no-data. 
    //This class might be used to indicate that the table is currently empty.
    const isTableData = table.querySelector('.no-data');
    // Create HTML for the new row based on the data received from the server
    let tableHtml = "<tr>";


    //Iterates over each property of the data object.
    //For each property, it checks if it's a direct property of the object (data.hasOwnProperty(key)).
    //If the property is dateAdded, it formats the value using toLocaleString() to convert it to a human-readable date and time.
    //Appends the value of each property as a table cell (<td>) to the tableHtml string.
    //{data: {id: 11, name: "Hasan", dateAdded: "2024-05-22T13:14:45.371Z"}}

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    //Adds delete and edit buttons to the table row HTML.
    //Each button has a data-id attribute set to the id property of the data object.
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

    //Appends a closing </tr> tag to the tableHtml string, indicating the end of the table row.
    tableHtml += "</tr>";

    //Checks if there is any existing table data (isTableData).
    //If there is existing data, it updates/adds the content of the table body (<tbody>) with the new row HTML (tableHtml).
    //If there is no existing data(no existing rows), it inserts a new row (<tr>) into the table using insertRow() and sets its inner HTML to the new row HTML.
    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}



// Function to load data into the HTML table
function LoadHTMLTable(data){
    const table = document.querySelector('table tbody');
    
     // If there is no data, display a message
    if (data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    // Create HTML for each row based on the data received from the server
    //This iterates over each element of the data array and executes the provided function for each element.
    //The function receives an object with properties id, name, and date_added as its argument.
    data.forEach(function({id, name, date_added}){
        console.log(id);
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class = "delete-row-btn" data-id =${id}>Delete</td>`;
        tableHtml += `<td><button class = "edit-row-btn" data-id =${id}>Edit</td>`;
        tableHtml += "</tr>";

    });

    // Insert the HTML into the table
    table.innerHTML = tableHtml;
}

// This section constructs the HTML markup for a table row (<tr>) using template literals.
// For each object in the data array, it creates a new row with five cells (<td>):
// The first cell contains the id.
// The second cell contains the name.
// The third cell contains the formatted date_added using toLocaleString() to display the date in a human-readable format.
// The fourth cell contains a delete button with a data-id attribute set to the id of the current object.
// The fifth cell contains an edit button with a data-id attribute set to the id of the current object.
// The constructed HTML for the row is appended to the tableHtml string