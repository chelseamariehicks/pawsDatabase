//home page query should be all dogs and cats
//for test purposes, limiting initially to just dogs

//set access to database - global so that all routes can use
//NOTE!!!
//set dbcon-test for test environment or dbcon-prod for prod environment
const mysql = require('../dbcon-test.js');

module.exports = {

    //GET request to render the homepage with default query (all animals regardless of status)
    getHomePage: (req, res) => {
        let query = "WITH animals AS (SELECT d.name, d.description, d.status, d.species, d.photo, d.dog_id AS id FROM dogs d UNION SELECT c.name, c.description, c.status, c.species, c.photo, c.cat_id AS id FROM cats c) SELECT name, description, photo, species, CASE species WHEN \"Dog\" THEN \"dogs\" WHEN \"Cat\" THEN \"cats\" END animaltype, a.status AS state, s.status, id FROM animals AS a INNER JOIN status s ON s.st_id = a.status ORDER BY name ASC";
        var animals;
        let message = "";
        let viewData = {};
        let pageTitle = "Our Current Animals";
        
        //execute query
        mysql.pool.query(query, function (err, result, fields) {
            if (err) {
                console.log('error!');
                console.error('error: ' + err.message);
                //pass error to view 500
                message = "Error with request. Homepage cannot load.";
                res.render('500', { title: "ERROR", message });
            }

            animals = result;

            //get status for the filter option - query dbs for status
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
                viewData = { title: "Home", message: "", status: status, animals: animals, pageTitle };

                //now that data is avail, render page
                res.render('home', viewData);
            });

        });
    },

    //POST - request to update the view of the home page showing a filtered view of animals
    postHomePage: function (req, res) {
        var animals;
        let message = "";
        let viewData = {};
        let pageTitle = "Our Current Animals";

        //get the request type from the form to determine the filtered view
        let stid = req.body.status; 
        console.log('statusID is: ' + stid);

        if (stid === "ALL") {
            res.redirect("/");
        }
        else {

            //confirm that is valid int
            stid = parseInt(stid);

            //verify id is an int
            if (!Number.isInteger(stid)) {
                console.log('error - stidid not integer - failing request');
                //pass error to view 500
                message = "Error with request. Cannot render homepage.";
                res.render('500', { title: "ERROR", message });
            }
            else { //it is int, so safe to query data to display the page again
                let query = "WITH animals AS (SELECT d.name, d.description, d.status, d.species, d.photo, d.dog_id AS id FROM dogs d UNION SELECT c.name, c.description, c.status, c.species, c.photo, c.cat_id AS id FROM cats c) SELECT name, description, photo, species, CASE species WHEN \"Dog\" THEN \"dogs\" WHEN \"Cat\" THEN \"cats\" END animaltype, a.status AS state, s.status, id FROM animals AS a INNER JOIN status s ON s.st_id = a.status WHERE a.status = ? ORDER BY name ASC";

                //execute query
                mysql.pool.query(query, stid, function (err, result, fields) {
                    if (err) {
                        console.log('error!');
                        console.error('error: ' + err.message);
                        //pass error to view 500
                        message = "Error with request. Homepage cannot load.";
                        res.render('500', { title: "ERROR", message });
                    }

                    animals = result;

                    //get status for the filter option - query dbs for status
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
                        viewData = { title: "Home", message: "", status: status, animals: animals, pageTitle };

                        //now that data is avail, render page
                        res.render('home', viewData);
                    });

                });
            }



        }



    }
};