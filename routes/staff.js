//all of the routes for the staff

//set access to database
//NOTE!!!
//set dbcon-test for test environment or dbcon-prod for prod environment
const mysql = require('../dbcon-test.js');

//contains code for each of the routes associated with the CRUD operations for staff

module.exports = {
    //route code for viewing the staff page - lists all staff member with select query
    getStaff: function (req, res) {
        //select staff query
        let query = "SELECT s.staff_id, s.f_name, s.l_name FROM staff s ORDER BY s.l_name ASC";
        let message = "";

        //execute query
        mysql.pool.query(query, function (err, result, fields) {
            if (err) {
                //res.redirect('/'); //back to index
                console.log('error!');
                console.error('error: ' + err.message);
                //pass error to view 500
                message = "Error with request. Staff cannot be found.";
                res.render('500', { title: "ERROR", message });
            }


            console.log(result);
            res.render('staff', { title: "View Staff", listResults: result });

        });
    },

    //GET REQUEST - get request for render newStaff page - the form for filling out to add a staff member
    newStaff: function (req, res) {

        //call mySQL to get the data for the locations
        let query = "SELECT loc_id, l_name FROM location";
        let locations = {};
        let status = {};
        let message = "";

        //execute query to get the location data
        mysql.pool.query(query, function (err, result, fields) {
            if (err) {
                console.log('error with location!');
                console.error('error: ' + err.message);
                //pass error to view 500
                message = "Error with request.";
                res.render('500', { title: "ERROR", message });
            }
            console.log(result);
            locations = result;

            let viewData = { title: "Add new Staff", message: "", locations: locations };

            res.render('newstaff', viewData);

        });

        
    },

    //POST REQUEST - post request for creating a new staff member
    addStaff: function (req, res) {

        //get data from post form data
        let f_name = req.body.f_name;
        let l_name = req.body.l_name;
        let location = req.body.location; //NOTE: if this value is NONE then no location was selected

        console.log(f_name + l_name + location);
        let context = {}; //to store results

        //INSERT the STAFF FIRST
        //create the mysql query command
        let sqlInsert = "INSERT INTO staff (`f_name`, `l_name`) VALUES (?, ?)";

        //get query string and insert into dbs
        mysql.pool.query(sqlInsert, [f_name, l_name], function (err, result) {
            if (err) {
                console.error('mySQL error: ' + err.message)
                //pass error to view 500
                message = "Error with request. Cannot add staff.";
                res.render('500', { title: "ERROR", message });
            }

            //determine whether location was selected for staff
            if (location != "NONE") {

                console.log("location is" + location);

                console.log(result);
                console.log("id is: ....");
                console.log(result.insertId);

                let stid = result.insertId;  //staff id based on newly inserted value

                //create the insertion query for the staff-location
                sqlInsert = "INSERT INTO staff_location (lid, stid) VALUES (?, ?)"

                mysql.pool.query(sqlInsert, [location, stid], function (err, result) {
                    if (err) {
                        console.error('mySQL error: ' + err.message)
                        //pass error to view 500
                        message = "Error with request. Cannot add staff assignment.";
                        res.render('500', { title: "ERROR", message });
                    }

                    res.redirect('/stafflocation'); //go the stafflocations view

                });

            }
            else {
                //no location assignment selected, so just go back to staff page
                res.redirect('/staff'); //go the staff page
            }

        });
    },
}



