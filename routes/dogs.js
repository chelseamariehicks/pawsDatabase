//all of the routes for the dogs

//set access to database
//NOTE!!!
//set dbcon-test for test environment or dbcon-prod for prod environment
const mysql = require('../dbcon-test.js');
const { sanitizeBody } = require('express-validator');

//array of values for dog breeds
var breedTypes = ["Mixed Breed - Large", "Mixed Breed - Medium", "Mixed Breed - Toy", "Afghan Hound",
    "Alaskan Malamute", "American Eskimo Dog", "American Foxhound", "American Staffordshire Terrier",
    "Australian Cattle Dog", "Australian Shepherd", "Australian Terrier", "Basenji", "Basset Hound",
    "Basset Hound", "Beagle", "Bernese Mountain Dog", "Bichon Frise", "Bloodhound", "Border Collie",
    "Boston Terrier", "Boxer", "Brittany Spaniel", "Brussels Griffon", "Bull Terrier", "Bulldog",
    "Cairn Terrier", "Cardigan Welsh Corgi", "Cavalier King Charles Spaniel", "Chesapeake Bay Retriever",
    "Chihuahua", "Chinese Crested", "Chinese Shar-Pei", "Chow", "Cocker Spaniel", "Collie",
    "Dachshund", "Dalmatian", "Doberman Pinscher", "English Foxhound", "English Setter", "French Bulldog",
    "German Shepherd", "Golden Retriever", "Great Dane", "Greyhound", "Havanese", "Irish Setter",
    "Italian Greyhound", "Labrador Retriever", "Lhasa Apso", "Malamute", "Maltese", "Mastiff",
    "Miniature Pinscher", "Miniature Poodle", "Miniature Schnauzer", "Newfoundland", "Norfolk Terrier",
    "Old English Sheepdog", "Papillon", "Pekinese", "Pembroke Welsh Corgi", "Pit Bull Terrier",
    "Pointer", "Pomeranian", "Poodle", "Pug", "Rottweiler", "Saint Bernard", "Shiba-Inu", "Shih-Tzu",
    "Siberian Husky", "Silky Terrier", "Smooth Fox Terrier", "Soft-Coated Wheaten Terrier",
    "Staffordshire Bull Terrier", "Standard Poodle", "Standard Schnauzer", "Toy Poodle", "Toy Terrier",
    "Weimaraner", "Welsh Springer Spaniel", "West Highland White Terrier", "Whippet",
    "Wire-Haired Fox Terrier", "Yorkshire Terrier"];


//contains code for each of the routes associated with the CRUD operations for dogs

module.exports = {
    //GET REQUEST - route code for viewing the dogs page - lists all dogs with select query
    getDogs: function (req, res) {
        //select dog query
        let query = "SELECT d.name, d.sex, date_format(d.dob, '%m/%d/%Y') AS dob, d.dog_id, d.breed, d.description, s.status, l.l_name, d.photo FROM dogs d INNER JOIN status s ON s.st_id = d.status INNER JOIN location l ON l.loc_id = d.location ORDER BY name ASC";
        let message = "";

        //execute query
        mysql.pool.query(query, function (err, result, fields) {
            if (err) {
                //res.redirect('/'); //back to index
                console.log('error!');
                console.error('error: ' + err.message);
                //pass error to view 500
                message = "Error with request. Dogs cannot be found.";
                res.render('500', { title: "ERROR", message });
            }
            //render page
            console.log(result);
            res.render('dogs', { title: "View Dogs", listResults: result });
        });
    },

    //GET REQUEST - get request for render newDog page - the form for filling out to add a dog
    newDog: function (req, res) {
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
                let viewData = { title: "Add Dog", message: "", breedList: breedTypes, status: status, locations: locations };

                //now that data is avail, render page
                res.render('newdog', viewData);
            });

        });
    },

    //POST REQUEST - post request for creating a new dog
    addDog: function (req, res) {
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
            let species = "Dog"; //dogs always species "Dog" value
            let location = req.body.location;
            //use the name of the input field (photo) to retrieve the uploaded file
            let photo = req.files.photo.name;  //the value of the file name uploaded

            console.log("inside filemv " + name + dob + photo);
            console.log(name, dob, description, color, status, breed, species, location);

            //create the mysql query command
            let sqlInsert = "INSERT INTO dogs (`name`, `dob`, `sex`, `description`, `color`, `status`, `breed`, `species`, `location`, `photo`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            //get query string and insert into dbs
            mysql.pool.query(sqlInsert, [name, dob, sex, description, color, status, breed, species, location, photo], function (err, result) {
                if (err) {
                    console.error('mySQL error: ' + err.message)
                    //pass error to view 500
                    message = "Error with request. Cannot add dog.";
                    res.render('500', { title: "ERROR", message });
                }

                //go back to dogs page - new dog should show there
                res.redirect('/dogs');
            });

        });
    }, 

    //GET REQUEST - Show a Single Dog Record
    viewDog: function (req, res) {
        //get the ID from the param passed to the view
        var id = req.params.id;
        console.log("id is: " + id);
        id = parseInt(id);
        let message = "";


        //verify id is an int
        if (!Number.isInteger(id)) {
            console.log('error - id not integer - failing request');
            //pass error to view 500
            message = "Error with request. Dog ID cannot be found.";
            res.render('500', { title: "ERROR", message});
        }
        else {
            //query dbs for just this one dog's record and then render the view
            //select dog query
            let query = "SELECT d.name, d.sex, date_format(d.dob, '%m/%d/%Y') AS dob, d.dog_id, d.breed, d.description, s.status, l.l_name, d.photo, d.color FROM dogs d INNER JOIN status s ON s.st_id = d.status INNER JOIN location l ON l.loc_id = d.location WHERE d.dog_id=?";

            //execute query
            mysql.pool.query(query, [id], function (err, result, fields) {
                if (err) {
                    //res.redirect('/'); //back to index
                    console.log('error!');
                    console.error('error: ' + err.message);
                    //pass error to view 500
                    message = "Error with request. Dog ID cannot be found.";
                    res.render('500', { title: "ERROR", message });

                }

                let message = "";  //will store optional message

                //check if empty results from query
                if (Object.keys(result).length == 0) {
                    message = "No results found.";
                }

                //render page
                console.log(result);

                //page data to pass into view
                let viewData = { title: "View Dog", listResults: result, message };

                res.render('viewdog', viewData);
            });
        }
    },

    //GET REQUEST - edit a single dog record - this is get request to view the edit page
    viewDogEdit: function (req, res) {
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
        else { //it is int, so safe to query for dog's record
            //query dbs for just this one dog's record and then render the view
            //select dog query
            let query = "SELECT d.name, d.sex, d.dob, d.dog_id, d.color, d.breed, d.description, s.status, s.st_id, l.loc_id, l.l_name, d.photo, date_format(d.dob, '%Y-%m-%d') AS dobformat FROM dogs d INNER JOIN status s ON s.st_id = d.status INNER JOIN location l ON l.loc_id = d.location WHERE d.dog_id=?"; 
            let message = ""; //will store optional message
            let viewData = {}; //stores all the data to pass to view
            let locations = {}; //stores locations for location drop-down
            let status = {}; //stores status for status drop-down
            let listResults = {}; //stores the data for the dog query

            //execute query to get data for the dog
            mysql.pool.query(query, [id], function (err, result, fields) {
                if (err) {
                    //if error - redirect to 500
                    console.log('error!');
                    console.error('error: ' + err.message);
                    message = "Error with request. Dog query failed.";
                    res.render('500', { title: "ERROR", message });

                }

                //check if empty results from query
                if (Object.keys(result).length == 0) {
                    message = "No results found.";
                    viewData = { title: "Edit Dog", listResults: result, message };
                    message = "Error with request. Cannot update dog.";
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
                        let viewData = { title: "Edit Dog", message: "", listResults: listResults, breedList: breedTypes, status: status, locations: locations };

                        //now that data is avail, render page
                        res.render('editdog', viewData);

                    });

                });
            });
        }
    },

    //POST REQUEST - route to update the dog's record - post request
    updateDog: function (req, res) {
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
        else { //it is int, so safe to update the dog's record

            //get the form fields
            //get data from post form data
            let name = req.body.name;
            let dob = req.body.dob;
            let description = req.body.description;
            let color = req.body.color;
            let sex = req.body.sex;
            let status = req.body.status;
            let breed = req.body.breed;
            let species = "Dog"; //dogs always species "Dog" value
            let location = req.body.location;
            //use the name of the input field (photo) to retrieve the uploaded file
            //let photo = req.files.photo.name;  //the value of the file name uploaded

            //sanitize the fields
            let badChars = '\\><$?!';
            sanitizeBody('name').blacklist('name', badChars);
            sanitizeBody('description').blacklist('description', badChars);

            let query = "UPDATE dogs d SET d.name=?, d.dob = ?, d.sex = ?, d.description = ?, d.color = ?, d.status = ?, d.breed = ?, d.location = ? WHERE d.dog_id = ?";
            let attributes = [name, dob, sex, description, color, status, breed, location, id];


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
                //select dog query
                let query = "SELECT d.name, d.sex, date_format(d.dob, '%m/%d/%Y') AS dob, d.dog_id, d.breed, d.description, s.status, l.l_name, d.photo, d.color FROM dogs d INNER JOIN status s ON s.st_id = d.status INNER JOIN location l ON l.loc_id = d.location WHERE d.dog_id=?";

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
                    let viewData = { title: "View Dog", listResults: result, message };

                    res.render('viewdog', viewData);
                });

            });

        }

    },

    //GET REQUEST - DELETE the DOG!
    deleteDog: function (req, res) {
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
        let query = "DELETE FROM dogs WHERE dog_id = ?";

        //execute query
        mysql.pool.query(query, [id], function (err, result, fields) {
            if (err) {
                //res.redirect('/'); //back to index
                console.log('error!');
                console.error('error: ' + err.message);
                message = "Error. Problem encountered with delete request.";
                res.render('500', { title: "ERROR", message });
            }
            res.redirect('/dogs');

        });
    }
};

