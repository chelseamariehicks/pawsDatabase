//all of the routes for the cats

//set access to database
//NOTE!!!
//set dbcon-test for test environment or dbcon-prod for prod environment
const mysql = require('../dbcon-test.js');
const { sanitizeBody } = require('express-validator');

//array of values for cats breeds
var breedTypes = ["Mixed Breed", "American Shorthair", "Calico",
    "Himalayan", "Persian"];

//contains code for each of the routes associated with the CRUD operations for cats
module.exports = {
    //GET REQUEST - route code for viewing the cats page - lists all cats with select query
    getCats: function (req, res) {
        //select cat query
        let query = "SELECT c.name, c.sex, date_format(c.dob, '%m/%d/%Y') AS dob, c.cat_id, c.breed, c.description, s.status, l.l_name, c.photo FROM cats c INNER JOIN status s ON s.st_id = c.status INNER JOIN location l ON l.loc_id = c.location ORDER BY name ASC";
        let message = "";

        //execute query
        mysql.pool.query(query, function (err, result, fields) {
            if (err) {
                //res.redirect('/'); //back to index
                console.log('error!');
                console.error('error: ' + err.message);
                //pass error to view 500
                message = "Error with request. Cats cannot be found.";
                res.render('500', { title: "ERROR", message });
            }
            //render page
            console.log(result);
            res.render('cats', { title: "View Cats", listResults: result });
        });
    },

    //GET REQUEST - get request for render newCat page - the form for filling out to add a cat
    newCat: function (req, res) {
        //call mySQL to get the data for the locations
        let query = "SELECT loc_id, l_name FROM location";
        let locations = {};
        let status = {};
        let message = "";

        //execute query to get the location data
        mysql.pool.query(query, function (err, result, fields) {
            if (err) {
                //res.redirect('/'); //back to index
                console.log('error with location!');
                console.error('error: ' + err.message);
                //pass error to view 500
                message = "Error with request.";
                res.render('500', { title: "ERROR", message });

            }
            console.log(result);
            locations = result;

            //execute query to get the data for status options
            query = "SELECT st_id, status FROM status";

            mysql.pool.query(query, function (err, result, fields) {
                if (err) {
                    console.log('error with status!');
                    console.error('error:' + err.message);
                    //pass error to view 500
                    message = "Error with request.";
                    res.render('500', { title: "ERROR", message });
                }

                status = result;
                //build the data object to send to ejs view
                let viewData = { title: "Add Cat", message: "", breedList: breedTypes, status: status, locations: locations };

                //now that data is avail, render page
                res.render('newcat', viewData);
            });

        });
    },

    //POST REQUEST - post request for creating a new cat
    addCat: function (req, res) {
        console.log(req.files);
        console.log(req.body.firstname);
        let message = "";

        //name of the input field is used to retrieve the uploaded file
        let file = req.files.photo;

        //FIGURE THIS OUT LATER - IF NO FILE UPLOADED THEN WHAT?
        if (!req.files || Object.keys(req.files).length === 0) {
            //pass error to view 500
            message = "Error with request. No photo found.";
            res.render('500', { title: "ERROR", message });
        }

        //use mv() to put the file somewhere on server
        file.mv('public/images/' + req.files.photo.name, function (err) {
            if (err) {
                console.log(err);
                //pass error to view 500
                message = "Error with request. No photo found.";
                res.render('500', { title: "ERROR", message });
            }

            //get data from post form data
            let name = req.body.name;
            let dob = req.body.dob;
            let sex = req.body.sex;
            let description = req.body.description;
            let color = req.body.color;
            let status = req.body.status;
            let breed = req.body.breed;
            let species = "Cat"; //cats always species "Cat" value
            let location = req.body.location;
            //use the name of the input field (photo) to retrieve the uploaded file
            let photo = req.files.photo.name;  //the value of the file name uploaded

            console.log("inside filemv " + name + dob + photo);
            console.log(name, dob, description, color, status, breed, species, location);

            //create the mysql query command
            let sqlInsert = "INSERT INTO cats (`name`, `dob`, `sex`, `description`, `color`, `status`, `breed`, `species`, `location`, `photo`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            //get query string and insert into dbs
            mysql.pool.query(sqlInsert, [name, dob, sex, description, color, status, breed, species, location, photo], function (err, result) {
                if (err) {
                    console.error('mySQL error: ' + err.message)
                    //pass error to view 500
                    message = "Error with request. Cannot add cat.";
                    res.render('500', { title: "ERROR", message });
                }

                //go back to cats page - new cat should show there
                res.redirect('/cats');
            });

        });
    },

    //GET REQUEST - Show a Single Cat Record
    viewCat: function (req, res) {
        //get the ID from the param passed to the view
        var id = req.params.id;
        console.log("id is: " + id);
        id = parseInt(id);
        let message = "";

        //verify id is an int
        if (!Number.isInteger(id)) {
            console.log('error - id not integer - failing request');
            //pass error to view 500
            message = "Error with request. Cat ID cannot be found.";
            res.render('500', { title: "ERROR", message });
        }
        else {
            //query dbs for just this one cat's record and then render the view
            //select cat query
            let query = "SELECT c.name, c.sex, date_format(c.dob, '%m/%d/%Y') AS dob, c.cat_id, c.breed, c.description, s.status, l.l_name, c.photo, c.color FROM cats c INNER JOIN status s ON s.st_id = c.status INNER JOIN location l ON l.loc_id = c.location WHERE c.cat_id=?";

            //execute query
            mysql.pool.query(query, [id], function (err, result, fields) {
                if (err) {
                    //res.redirect('/'); //back to index
                    console.log('error!');
                    console.error('error: ' + err.message);
                    //pass error to view 500
                    message = "Error with request. Cat ID cannot be found.";
                    res.render('500', { title: "ERROR", message });
                }

                //check if empty results from query
                if (Object.keys(result).length == 0) {
                    message = "No results found.";
                }

                //render page
                console.log(result);

                //page data to pass into view
                let viewData = { title: "View Cat", listResults: result, message };

                res.render('viewcat', viewData);
            });
        }
    },

    //GET REQUEST - edit a single cat record - this is get request to view the edit page
    viewCatEdit: function (req, res) {
        //get the ID from the param passed to the view and validate that it is integer
        var id = req.params.id;
        console.log("id is: " + id);
        id = parseInt(id);
        let message = "";

        //verify id is an int
        if (!Number.isInteger(id)) {
            console.log('error - id not integer - failing request');
            //pass error to view 500
            message = "Error with request. Cat ID cannot be found.";
            res.render('500', { title: "ERROR", message });
        }
        else { //it is int, so safe to query for cat's record
            //query dbs for just this one cat's record and then render the view
            //select cat query
            let query = "SELECT c.name, c.sex, c.dob, c.cat_id, c.color, c.breed, c.description, s.status, s.st_id, l.loc_id, l.l_name, c.photo, date_format(c.dob, '%Y-%m-%d') AS dobformat FROM cats c INNER JOIN status s ON s.st_id = c.status INNER JOIN location l ON l.loc_id = c.location WHERE c.cat_id=?";
            let viewData = {}; //stores all the data to pass to view
            let locations = {}; //stores locations for location drop-down
            let status = {}; //stores status for status drop-down
            let listResults = {}; //stores the data for the cat query

            //execute query to get data for the cat
            mysql.pool.query(query, [id], function (err, result, fields) {
                if (err) {
                    //if error - redirect to 500
                    console.log('error!');
                    console.error('error: ' + err.message);
                    message = "Error with request. Cannot update cat.";
                    res.render('500', { title: "ERROR", message });

                }

                //check if empty results from query
                if (Object.keys(result).length == 0) {
                    message = "No results found.";
                    viewData = { title: "Edit Cat", listResults: result, message };
                    //render the empty page, since no data is found
                    res.render('500', { title: "ERROR", message });

                }

                //query result for debug
                console.log(result);
                listResults = result;

                //query to get location
                query = "SELECT loc_id, l_name FROM location";
                //execute query to get the location data
                mysql.pool.query(query, function (err, result, fields) {
                    if (err) {
                        console.log('error with location!');
                        console.error('error: ' + err.message);
                        message = "Error with request. Location query failed.";
                        res.render('500', { title: "ERROR", message });
                    }

                    console.log(result);
                    locations = result;

                    //execute query to get the data for status options
                    query = "SELECT st_id, status FROM status";

                    mysql.pool.query(query, function (err, result, fields) {
                        if (err) {
                            console.log('error with status!');
                            console.error('error:' + err.message);
                            message = "Error with request. Message query failed.";
                            res.render('500', { title: "ERROR", message });
                        }

                        status = result;

                        //build the data object to send to ejs view
                        let viewData = { title: "Edit Cat", message: "", listResults: listResults, breedList: breedTypes, status: status, locations: locations };

                        //now that data is avail, render page
                        res.render('editcat', viewData);

                    });

                });
            });
        }
    },

    //POST REQUEST - route to update the cat's record - post request
    updateCat: function (req, res) {
        //get the ID from the param passed to the view and validate that it is integer
        var id = req.params.id;
        console.log("id is: " + id);
        id = parseInt(id);
        let message = "";

        //verify id is an int
        if (!Number.isInteger(id)) {
            console.log('error - id not integer - failing request');
            //pass error to view 500
            let message = "Error with request. Cat ID cannot be found.";
            res.render('500', { title: "ERROR", message });
        }
        else { //it is int, so safe to update the cat's record

            //get the form fields
            //get data from post form data
            let name = req.body.name;
            let dob = req.body.dob;
            let sex = req.body.sex;
            let description = req.body.description;
            let color = req.body.color;
            let status = req.body.status;
            let breed = req.body.breed;
            let species = "Cat"; //cats always species "Cat" value
            let location = req.body.location;
            //use the name of the input field (photo) to retrieve the uploaded file

            //sanitize the fields
            let badChars = '\\><$?!';
            sanitizeBody('name').blacklist('name', badChars);
            sanitizeBody('description').blacklist('description', badChars);

            let query = "UPDATE cats c SET c.name=?, c.dob = ?, c.sex = ?, c.description = ?, c.color = ?, c.status = ?, c.breed = ?, c.location = ? WHERE c.cat_id = ?";
            let attributes = [name, dob, sex, description, color, status, breed, location, id];
            let message = "";

            //create the update query
            mysql.pool.query(query, attributes, function (err, result) {
                //generate error
                if (err) {
                    console.log('error updating!');
                    console.error('error:' + err.message);
                    message = "Error. Record not updated.";
                    res.render('500', { title: "ERROR", message });
                }

                message = "Record updated.";

                //requery the results for record to send to the main page
                //select cat query
                let query = "SELECT c.name, c.sex, date_format(c.dob, '%m/%d/%Y') AS dob, c.cat_id, c.breed, c.description, s.status, l.l_name, c.photo, c.color FROM cats c INNER JOIN status s ON s.st_id = c.status INNER JOIN location l ON l.loc_id = c.location WHERE c.cat_id=?";

                //execute query
                mysql.pool.query(query, [id], function (err, result, fields) {
                    if (err) {
                        //res.redirect('/'); //back to index
                        console.log('error!');
                        console.error('error: ' + err.message);
                        message = "Error. Problem encountered with view lookup.";
                        res.render('500', { title: "ERROR", message });
                    }


                    //check if empty results from query
                    if (Object.keys(result).length == 0) {
                        message = "No results found.";
                    }

                    //render page
                    console.log(result);

                    //page data to pass into view
                    let viewData = { title: "View Cat", listResults: result, message };

                    res.render('viewcat', viewData);
                });

            });

        }

    },

    //GET REQUEST - DELETE the Cat!
    deleteCat: function (req, res) {
        //get the ID from the param passed to the view and validate that it is integer
        var id = req.params.id;
        console.log("id is: " + id);
        id = parseInt(id);
        let message = "";

        //verify id is an int
        if (!Number.isInteger(id)) {
            console.log('error - id not integer - failing request');
            //pass error to view 500
            message = "Error with request. Dog ID cannot be found.";
            res.render('500', { title: "ERROR", message });
        }

        //it is safe, create query 
        let query = "DELETE FROM cats WHERE cat_id = ?";

        //execute query
        mysql.pool.query(query, [id], function (err, result, fields) {
            if (err) {
                //res.redirect('/'); //back to index
                console.log('error!');
                console.error('error: ' + err.message);
                message = "Error. Problem encountered with delete request.";
                res.render('500', { title: "ERROR", message });
            }


            res.redirect('/cats');

        });

    },

};
