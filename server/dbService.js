const mysql =  require('mysql'); // Import the mysql module for database interactions
const dotenv =  require('dotenv'); // Import the dotenv module to load environment variables from a .env file
let instance = null; // Initialize a variable to hold the singleton instance of the database service
dotenv.config(); // Load environment variables from the .env file into process.env

// Create a connection to the MySQL database using environment variables
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

// Connect to the MySQL database
connection.connect((err) => {

     // If there's an error, log the error message
    if(err){
        console.log(err.message);
    }

    // Log the connection state (connected or disconnected)
    console.log('db' + connection.state);
})

// Define a class for the database service
class DbService{

    // Method to get the singleton instance of the database service
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    // Method to get all data from the "names" table
    //A new Promise is created. This promise will handle an asynchronous operation, in this case, a database query.
    //The await keyword is used to pause the execution of the function until the promise is resolved or rejected,
    // and then the result of the promise is assigned to the response variable.
    async getAllData(){
        try {
            const response = await new Promise((resolve, reject) =>{
                const query = "SELECT * FROM names;";

                //Executes the SQL query using the connection.query method.
                //This method takes the query string and a callback function as arguments.
                connection.query(query, (err, results) => {

                    //If an error occurs during the query execution, the promise is rejected with a new Error object
                    // containing the error message. This will cause the catch block to handle the error
                    if(err) reject(new Error(err.message));

                    //If the query is successful, the promise is resolved with the results obtained from the database.
                    //results contains the data retrieved by the query (all rows from the names table).
                    resolve(results);
                })
            });

           // console.log(response);
            return response;

        } catch(error){

            console.log(error);
        }
    }

    // Method to insert a new name into the "names" table
    async insertNewName(name){
        try {

            // Get the current date and time
            const dateAdded = new Date();

            // Return a promise that resolves with the inserted row ID
            const insertId = await new Promise((resolve, reject) =>{

                //The query uses placeholders (?) for values that will be provided later.
                const query = "INSERT INTO names(name, date_added) VALUES (?,?);";

                //Executes the SQL query using the connection.query method.
                //method takes the query string, an array of values to replace the placeholders in the query ([name, dateAdded]), and a callback function as arguments.
                //name and dateAdded are the values to be inserted into the name and date_added columns, respectively.
                connection.query(query,[name, dateAdded], (err,result) => {
                    if(err) reject(new Error(err.message));

                    //If the query is successful, the promise is resolved with the insertId, which is the ID of the newly inserted row.
                    resolve(result.insertId);
                })
            });

           // Return an object containing the inserted row details
            return {
                id: insertId,
                name : name,
                dateAdded : dateAdded
            };

        } catch(error){

            console.log(error);
        }
    }

    // Method to delete a row from the "names" table by ID
    async deleteRowById(id) {
        try {

            // Convert the ID to an integer
            id = parseInt(id, 10); 

            // Return a promise that resolves with the number of affected rows
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?";
    
                connection.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));

                    //result.affectedRows contains the number of rows affected by the DELETE operation, 
                    //which typically should be either 1 (if a row was deleted) or 0 (if no row matched the condition).
                    resolve(result.affectedRows);
                })
            });
    
              // Return true if one row was affected, otherwise false
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ? WHERE id = ?";
    
                connection.query(query, [name, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByName(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM names WHERE name = ?;";

                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });

            return response;
        } catch (error) {
            console.log(error);
        }
    }

}
// Export the DbService class as a module
module.exports = DbService;