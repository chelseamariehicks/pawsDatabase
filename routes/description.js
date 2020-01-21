//route for temporary page describing the details of each static page on site for Project Step 3
//set access to database
//NOTE!!!
//set dbcon-test for test environment or dbcon-prod for prod environment
const mysql = require('../dbcon-test.js');

//contains code for the route associated with the CRUD operations for description

module.exports = {
    getDescription: function (req, res) {
        //select staff query
        let query = "SELECT s.f_name, s.l_name FROM staff s ORDER BY s.l_name ASC";

        //execute query
        mysql.pool.query(query, function (err, result, fields) {
            if (err) {
                //res.redirect('/'); //back to index
                console.log('error!');
                console.error('error: ' + err.message);
            }

            console.log(result);
            res.render('description', { title: "Description of Pages:", listResults: result });
        });
    }

}