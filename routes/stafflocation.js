//the route for stafflocation

//set access to database
//NOTE!!!
//set dbcon-test for test environment or dbcon-prod for prod environment
const mysql = require('../dbcon-test.js');

module.exports = {
    //route code for viewing the staff page - lists all staff member with select query
    getStaffLocations: function (req, res) {
        //select staff-locations query
        let query = "WITH raw_data AS (SELECT sl.sl_id, sl.lid, sl.stid, l.l_name AS location, s.f_name, s.l_name, CONCAT(s.f_name, ' ', s.l_name) AS full_name FROM staff_location sl INNER JOIN location l ON l.loc_id = sl.lid INNER JOIN staff s ON s.staff_id = sl.stid ORDER BY l.l_name) SELECT lid, location, GROUP_CONCAT(DISTINCT full_name SEPARATOR ', ') AS staffdata FROM raw_data GROUP BY lid;";
        let message = "";

        //execute query
        mysql.pool.query(query, function (err, result, fields) {
            if (err) {
                //res.redirect('/'); //back to index
                console.log('error!');
                console.error('error: ' + err.message);
                //pass error to view 500
                message = "Error with request. Staff-locations cannot be found.";
                res.render('500', { title: "ERROR", message });

            }


            console.log(result);
            res.render('stafflocation', { title: "View Staff at Locations", listResults: result, message });

        });
    },

    //GET REQUEST - Show a single Location record with all employees at location allowing them to then edit the results
    viewStaffLocation: function (req, res) {
        //get the ID from the param passed to the view
        var locID = req.params.id;
        console.log("id is: " + locID);
        locID = parseInt(locID);
        let message = "";
        let locationAssignments; //will hold the results from the staff-location results for the location at locID
        let newStaff;   //will hold the list of staff that can be assigned to this locID
        let staffExists; //holds the state of whether or not there is staff

        //verify id is an int
        if (!Number.isInteger(locID)) {
            console.log('error - id not integer - failing request');
            //pass error to view 500
            message = "Error with request. Location ID cannot be found.";
            res.render('500', { title: "ERROR", message });
        }
        else {
            //query dbs for just this one location's record and then render the view
            //select location query
            let query = "SELECT sl.sl_id, sl.lid, sl.stid, l.l_name AS location, s.f_name, s.l_name FROM staff_location sl INNER JOIN location l on l.loc_id = sl.lid INNER JOIN staff s ON s.staff_id = sl.stid WHERE sl.lid = ?;";

            //execute query
            mysql.pool.query(query, [locID], function (err, result, fields) {
                if (err) {
                    //res.redirect('/'); //back to index
                    console.log('error!');
                    console.error('error: ' + err.message);
                    //pass error to view 500
                    message = "Error with request. Location ID cannot be found.";
                    res.render('500', { title: "ERROR", message });
                }

                //check if empty results from query
                if (Object.keys(result).length == 0) {
                    message = "No results found.";
                }

                locationAssignments = result; //holds the list of staff at that location

                //now query to get the dropdown menu for Staff
                query = "SELECT s.staff_id, s.f_name, s.l_name FROM staff s WHERE s.staff_id NOT IN(SELECT s.staff_id FROM staff s INNER JOIN staff_location sl ON sl.stid = s.staff_id WHERE sl.lid = ?)";

                mysql.pool.query(query, [locID], function (err, result, fields) {
                    //render happens inside this query as it is callback
                    if (err) {
                        //res.redirect('/'); //back to index
                        console.log('error!');
                        console.error('error: ' + err.message);
                        //pass error to view 500
                        message = "Error with request. Unable to retrieve Staff for this Location.";
                        res.render('500', { title: "ERROR", message });
                    }

                    console.log(result);

                    //check if empty results from query
                    if (Object.keys(result).length == 0) {
                        staffExists = 0;  //tailor variable so that view can determine not to show an empty dropdown
                        newStaff = 0;
                    }
                    else {
                        newStaff = result;
                        staffExists = 1;
                    }

                    //render page
                    console.log(result);

                    //page data to pass into view
                    let viewData = { title: "Edit Staff Location", listResults: locationAssignments, newStaff: newStaff, staffExists, message, locID: locID };

                    res.render('editstaffloc', viewData);

                });

            });
        }
    },

    //POST REQUEST - post request for assigning staff to location when the dropdown is submitted on editstaffloc.ejs
    assignStaffLocation: function (req, res) {
        //get data from the post form data - only way to get to this view is by clicking 'submit' on the editstaff dropdown
        let staff = req.body.staff; 
        
        //get the ID from the param passed to the view
        var locID = req.params.id;
        console.log("id is: " + locID);
        locID = parseInt(locID);
        
        let context = {}; //to store results

        console.log("staff is" + staff);

        let sqlInsert = "INSERT INTO staff_location (lid, stid) VALUES (?, ?)"

        mysql.pool.query(sqlInsert, [locID, staff], function (err, result) {
            if (err) {
                console.error('mySQL error: ' + err.message)
                //pass error to view 500
                message = "Error with request. Cannot add staff-location assignment.";
                res.render('500', { title: "ERROR", message });
            }

            res.redirect('/stafflocation'); //go the stafflocations view

        });

    },

    //POST - DELETE a staff-location record from the m:m 
    deleteStaffLocation: function (req, res) {
        //get the staff-location record ID from the param passed to the view
        var slid = req.params.id;
        console.log("id is: " + slid);
        slid = parseInt(slid);
        let message = "";

        //verify id is an int
        if (!Number.isInteger(slid)) {
            console.log('error - id not integer - failing request');
            //pass error to view 500
            message = "Error with request. Staff-location ID cannot be found.";
            res.render('500', { title: "ERROR", message });
        }
        else {
            //query dbs for just this one staff-loc record and then render the view
            let query = "DELETE FROM staff_location WHERE sl_id = ?;"

            //execute query
            mysql.pool.query(query, [slid], function (err, result, fields) {
                if (err) {
                    //res.redirect('/'); //back to index
                    console.log('error!');
                    console.error('error: ' + err.message);
                    //pass error to view 500
                    message = "Error with request. Staff-location ID cannot be found.";
                    res.render('500', { title: "ERROR", message });
                }

                //check if empty results from query
                if (Object.keys(result).length == 0) {
                    message = "No results found.";
                }

                //render page
                console.log(result);

                //return to the stafflocations main view
                res.redirect("/stafflocation");
            });

        }

    },




}

