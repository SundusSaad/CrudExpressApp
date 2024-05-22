const express =  require('express');
const app =  express();
const cors =  require('cors'); //CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const dotenv =  require('dotenv'); //dotenv is an npm JavaScript package that loads environment variables from a . env file into the process. 

dotenv.config(); // a method which is provided by the dotenv module to config the env files
const dbService = require('./dbService') // Import the custom database service module from the dbService.js file
app.use(cors()); // Enable Cross-Origin Resource Sharing for all routes, This allows your server to accept requests from different origins.
app.use(express.json()); // Middleware to parse incoming requests with JSON payloads, This is necessary for handling requests where the body is sent in JSON format, automatically parsing it and making it available in req.body.
app.use(express.urlencoded({extended : false})); // Middleware to parse incoming requests with URL-encoded payloads
// When extended is false, it uses the querystring library for parsing


//create

//This defines a POST route at the path /insert.
//When a POST request is made to this endpoint, the callback function is executed.
app.post('/insert', (request, response) => {

    //  Destructuring means Extracts the name property from the request.body.
    //request.body contains the data sent in the body of the POST request, typically in JSON format.
    
    const {name} = request.body;
    const db = dbService.getDbServiceInstance();
   
    //This method inserts the name into a database and returns a promise.
    const result = db.insertNewName(name);


    //Sends a JSON response with the inserted data containing the data received from the database (e.g., the inserted record). if the insertion is successful.
    //Logs an error if the insertion fails.
    result
   .then(data => response.json({data: data}))
   .catch(err => console.log(err));
 
});

//read
app.get('/getAll', (request, response) => {
   const db = dbService.getDbServiceInstance();
   
   const result = db.getAllData();

   result
   .then(data => response.json({data: data}))
   .catch(err => console.log(err));
});

//update

//The route handles PATCH requests to /update.
app.patch('/update', (request, response) => {

    //It extracts id and name from the request body.
    const { id , name} = request.body;
    const db = dbService.getDbServiceInstance();
    //It uses the database service to update the name for the given id.
    const result = db.updateNameById(id, name);
    
    //It sends a json success response if the update is successful or logs an error if it fails.
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});



//delete
app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

//search
app.get('/search/:name', (request, response) => {
    const { name } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(name);
    
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})

app.listen(process.env.PORT, () => console.log('app is running'));

//app.listen starts the server and makes it listen for incoming connections.
//process.env.PORT dynamically sets the port number from an environment variable, which is useful for flexible deployment configurations.
//The callback function logs a message to indicate that the server is running, confirming that the server has successfully started and is listening on the specified port.