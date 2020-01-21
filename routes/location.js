//all of the routes for locations

//set access to database
//NOTE!!!
//set dbcon-test for test environment or dbcon-prod for prod environment
const mysql = require('../dbcon-test.js');

//contains code for each of the routes associated with the CRUD operations for locations

module.exports = {
    //route code for viewing the locations page - lists all locations with select query
    getLocations: function (req, res) {
        //select location query
        let query = "SELECT l.loc_id, l.l_name FROM location l ORDER BY l.loc_id ASC";

        //execute query
        mysql.pool.query(query, function (err, result, fields) {
            if (err) {
                //res.redirect('/'); //back to index
                console.log('error!');
                console.error('error: ' + err.message);
            }

            console.log(result);
            res.render('locations', { title: "View Locations", listResults: result });

        });
    },

    //GET REQUEST - get request for render newLocations page - the form for filling out to add a location
    newLocations: function (req, res) {
        res.render('newlocations', { title: "Add new location", message: "" }); 
    },

    //POST REQUEST - post request for creating a new location
    addLocations: function (req, res) {

        //get data from post form data
        let l_name = req.body.l_name;

        console.log(l_name);

        //create the mysql query command
        let sqlInsert = "INSERT INTO location (`l_name`) VALUES (?)";

        //get query string and insert into dbs
        mysql.pool.query(sqlInsert, [l_name], function (err, result) {
            if (err) {
                console.error('mySQL error: ' + err.message)
                //pass error to view 500
                message = "Error with request. Cannot add location.";
                res.render('500', { title: "ERROR", message });
            }

            //go back to locations page - new location should show there
            res.redirect('/locations');

        });
    },

};