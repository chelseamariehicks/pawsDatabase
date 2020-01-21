function checkAnimalForm(form) {

    //check the name and description to ensure it is valid alphanumeric
    var name = form.name.value;
    var description = form.description.value;
    console.log("name is " + name);
    console.log("description is " + description);
    var message1 = ""; //for name
    var message2 = ""; //for description


    if (!stringIsAlphaNum(name)) {
        message1 = "Name must be alpha numeric. ";
    }

    if (description.length > 0 && !stringIsAlphaNumSpecChar(description)) {
        message2 = "Description may only contain the letters a-z, 0-9, commas, periods, or exclamation points.";
        console.log("fail on description test");
    }


    document.getElementById("error1").innerHTML = message1;
    document.getElementById("error2").innerHTML = message2;

    //determine whether to submit form - if there's a message, there's an error - don't post
    if (message1.length > 0 || message2.length > 0) {
        return false;
    }

    return true;  //no error, safe to post

}

function checkLocationForm(form) {
    //check location name to ensure it is valid alphanumeric
    var location = form.l_name.value;
    console.log(location);

    //build error
    var message1 = "";

    //test field and customize error
    if (!stringIsAlphaNum(location)) {
        message1 = "Location name must be alphanumeric only. "
        console.log("fail on location");
        //assign message text to the DOM
        document.getElementById("error1").innerHTML = message1;
        return false;
    }


    return true;  //no error, safe to post

}

function checkStaffForm(form) {
    //check the firstname and lastname to ensure it is valid alphanumeric
    var firstname = form.f_name.value;
    var lastname = form.l_name.value;
    console.log("name is " + firstname + lastname);

    //build the error messages
    var message1 = "";  //for firstname
    var message2 = ""; //for lastname

    //test each field with if statement and customize corresponding error message
    if (!stringIsAlphaNum(firstname)) {
        message1 = "First name must be alpha only. "
        console.log("fail on firstname");
    }

    if (!stringIsAlphaNum(lastname)) {
        message2 = "Last name must be alpha only";
        console.log("fail on lastname test");
    }

    //assign message text to the DOM
    document.getElementById("error1").innerHTML = message1;
    document.getElementById("error2").innerHTML = message2;

    //determine whether to submit form - if there's a message, there's an error - don't post
    if (message1.length > 0 || message2.length > 0) {
        return false;
    }

    return true;  //no error, safe to post

}




//loops through a string and determines whether it is alphaNumeric 
//allows alphanumeric and space character
//source: https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
function stringIsAlphaNum(stringVal) {
    var code, index;


    for (index = 0; index < stringVal.length; index++) {
        code = stringVal.charCodeAt(index);

        if (!(code > 47 && code < 58) &&  //numeric (0-9)
            !(code > 64 && code < 91) &&  //upper alpha (A-Z)
            !(code > 96 && code < 123) && //lower alpha (a-z)
            !(code === 32)) {               //not a space char
            console.log("fail on alphanum test");
            return false;
        }

    }

    return true; //is alphanum 
}





//loops through a string and determines whether it is alphaNumeric or special allowed chars
//source: https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
function stringIsAlphaNumSpecChar(stringVal) {
    var code, index;


    //SOMETHING WRONG HERE WHEN TRYING TO SIMPLIFY CODE!!
    /*
    for (index = 0; index < stringVal.length; index++) {
        code = stringVal.charCodeAt(index);
        console.log(code);
        if (stringIsAlphaNum(code) === false &&  //numeric (0-9), alpha
            (code === 32 || code === 33 || code === 46 || code === 44) === false ) { //spec allowed characters

            return false;
        } 
       
    }
    */

    for (index = 0; index < stringVal.length; index++) {
        code = stringVal.charCodeAt(index);

        if (!(code > 47 && code < 58) &&  //numeric (0-9)
            !(code > 64 && code < 91) &&  //upper alpha (A-Z)
            !(code > 96 && code < 123) && //lower alpha (a-z)
            !(code === 32 || code === 33 || code === 46 || code === 44) //spec allowed characters
        ) {

            return false;
        }

    }




    return true; //is alphanum or has an allowed special character
}

//inputs a date value
function putDate(dateVal) {
    var dateControl = document.querySelector('input[type="date"]');
    dateControl.value = dateVal;
    console.log(dateControl.value);
}