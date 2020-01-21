'use strict';
var http = require('http');
var port = process.env.PORT || 1337;

//configure modules to use
//express configuration
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const path = require('path');  //middleware to see the paths
const { check, validationResult } = require('express-validator'); //used for data validation in forms
const { sanitizeBody } = require('express-validator');



//ROUTES - import modules - each route must have const to import the module page
const { getHomePage, postHomePage } = require('./routes/index.js');
const { getDogs, newDog, addDog, viewDog, viewDogEdit, updateDog, deleteDog } = require('./routes/dogs.js');
const { getCats, newCat, addCat, viewCat, viewCatEdit, updateCat, deleteCat } = require('./routes/cats.js');
const { getStaff, newStaff, addStaff } = require('./routes/staff.js');
const { getLocations, newLocations, addLocations } = require('./routes/location.js');
const { getStaffLocations, viewStaffLocation, updateStaffLocation, assignStaffLocation, deleteStaffLocation } = require('./routes/stafflocation.js');
//const { getDescription } = require('./routes/description.js');

//set access to database - global so that all routes can use
//NOTE!!!
//set dbcon-test for test environment or dbcon-prod for prod environment
const mysql = require('./dbcon-test.js'); //make sure gitignore file


// CONFIGURE MIDDLEWARE
app.set('views', __dirname + '/views'); //set expres to look here for rendering view
app.set('view engine', 'ejs'); //use res.render to load up an ejs view file
app.use(express.static(path.join(__dirname, 'public')));  //tell express to find public files, give access to the CSS and public elements
app.use(bodyParser.urlencoded({ extended: true })); //tell express to use bodyparser
app.use(bodyParser.json()); //parse form data client
app.use(fileUpload()); //configure fileupload


//temp array to hold data until dbs config'd
var dogs = [
    { name: "Buddy", dob: "2018-01-01", breed: "pomeranian", color: "golden", sex: "M", status: "Available", location: "Dog Kennel 3", id: 1, description: "A very good boy, sometimes timid. Likes cats", image: "/images/boo.png" },
    { name: "Sam", dob: "2018-01-01", breed: "pomeranian", color: "golden", sex: "M", status: "Available", location: "Dog Kennel 3", id: 2, description: "Barks a lot and needs work on house training", image: "/images/boo.png"  },
    { name: "Ralph", dob: "2018-01-01", breed: "pomeranian", color: "golden", sex: "M", status: "Available", location: "Dog Kennel 3", id: 3, description: "Needs special attention. Some fear aggression when dressing in outfits.", image: "/images/boo.png"  },
    { name: "George", dob: "2018-01-01", breed: "pomeranian", color: "golden", sex: "M", status: "Available", location: "Dog Kennel 3", id: 4, description: "A very good boy, sometimes timid. Likes cats", image: "/images/boo.png" },
    { name: "Bub", dob: "2018-01-01", breed: "pomeranian", color: "golden", sex: "M", status: "Available", location: "Dog Kennel 3", id: 5, description: "Barks a lot and needs work on house training", image: "/images/boo.png" },
    { name: "Gizmo", dob: "2018-01-01", breed: "pomeranian", color: "golden", sex: "M", status: "Available", location: "Dog Kennel 3", id: 6, description: "Needs special attention. Some fear aggression when dressing in outfits.", image: "/images/boo.png" }

]

var cats = [
    { name: "Buddy", dob: "2018-01-01", breed: "himalayan", color: "gray", sex: "M", status: "Available", location: "Cat Kennel", id: 1, description: "A very good boy, sometimes timid. Likes cats", image: "/images/boo.png" },
    { name: "Sam", dob: "2018-01-01", breed: "himalayan", color: "gray", sex: "M", status: "Available", location: "Cat Kennel", id: 2, description: "Barks a lot and needs work on house training", image: "/images/boo.png" },
    { name: "Ralph", dob: "2018-01-01", breed: "himalayan", color: "gray", sex: "M", status: "Available", location: "Cat Kennel", id: 3, description: "Needs special attention. Some fear aggression when dressing in outfits.", image: "/images/boo.png" },
    { name: "George", dob: "2018-01-01", breed: "himalayan", color: "gray", sex: "M", status: "Available", location: "Cat Kennel", id: 4, description: "A very good boy, sometimes timid. Likes cats", image: "/images/boo.png" },
    { name: "Bub", dob: "2018-01-01", breed: "himalayan", color: "gray", sex: "M", status: "Available", location: "Cat Kennel", id: 5, description: "Barks a lot and needs work on house training", image: "/images/boo.png" },
    { name: "Gizmo", dob: "2018-01-01", breed: "himalayan", color: "gray", sex: "M", status: "Available", location: "Cat Kennel", id: 6, description: "Needs special attention. Some fear aggression when dressing in outfits.", image: "/images/boo.png" }

]

var staff2 = [
    { f_name: "Buddy", l_name: "Smith" },
    { f_name: "Mary", l_name: "Smith" },
    { f_name: "Lee", l_name: "Smith" },
]

var location = [
    { l_name: "Cat Kennel" },
    { l_name: "Dog Kennel" },

]


// RESTFUL ROUTES - CALLING THE JS ROUTE PAGE
app.get("/", getHomePage);
app.post("/home", postHomePage);

//dogs
app.get("/dogs", getDogs);
app.get("/dogs/new", newDog);
app.post("/dogs/new", addDog);
app.get("/dogs/:id", viewDog);
app.post("/dogs/:id", updateDog);
app.get("/dogs/:id/delete", deleteDog);
app.get("/dogs/:id/edit", viewDogEdit);

//cats
app.get("/cats", getCats);
app.get("/cats/new", newCat);
app.post("/cats/new", addCat);
app.get("/cats/:id", viewCat);
app.post("/cats/:id", updateCat);
app.get("/cats/:id/delete", deleteCat);
app.get("/cats/:id/edit", viewCatEdit);

//staff
app.get("/staff", getStaff);
app.get("/staff/new", newStaff);
app.post("/staff/new", addStaff);

//locations
app.get("/locations", getLocations);
app.get("/locations/new", newLocations);
app.post("/locations/new", addLocations);

//stafflocation
app.get("/stafflocation", getStaffLocations);
app.get("/stafflocation/:id", viewStaffLocation)
//app.get("/stafflocation/:id", updateStaffLocation);
app.post("/stafflocation/:id", assignStaffLocation);
app.post("/stafflocation/:id/delete", deleteStaffLocation);


//TO DELETE LATER
app.get("/description", function (req, res) {

    res.render("description", { title: "Page Index" });

});



//test routes for uploading a photo - this is functional. YET - inside NEW DOGS - NOT FUNCTION!
app.get("/test", function (req, res) {
    res.render('test', { title: "test" });

});

app.post("/upload", function (req, res) {
    console.log(req.files);
    console.log(req.body.firstname);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No file uploaded');
    }

    //name of the input field is used to retrieve the uploaded file
    let file = req.files.photo;

    //use mv() to put the file somewhere on server
    file.mv('public/images/' + req.files.photo.name, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.send('File uploaded!');
    });


});




/*
app.get("/dogs", getDogs);
app.get("/dogs/edit/:id", editDog);
app.get("/dogs/delete/:id", deleteDog);
app.post("/dogs/add", addDog);



*/








//renders the page for 404 requests
app.use(function (req, res) {
    res.status(404);
    res.render('404', { title: "ERROR 404" });
});

//renders the page for bad 500 requests
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    let message = "ERROR - BAD REQUEST";  
    res.render('500', { title: "ERROR 500", message });
});



//express listener to start server
app.listen(port, function () {
    console.log('Express started on http://localhost:' + port + ' Ctrl-C to terminate');
});
