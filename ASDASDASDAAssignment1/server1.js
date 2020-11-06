

var express = require('express'); //Run express
var app = express(); //Start express
var myParser = require("body-parser"); //Require body-parser
var products = require("./public/products.js"); //Require products_data.js file
const querystring = require('querystring'); //Requrie the querystring from the form

//Retrieved from Lab13
app.use(myParser.urlencoded({ extended: true }));

//Retrieved from Lab13
//Logs the method and path into the console
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

//POST the data from the process form where the action is 'process_form'
app.post("/process_form", function (request, response) {
    let POST = request.body;
    var hasValidQuantities = true; //Assume empty quantity textbook is true & valid
    var hasPurchases = false; //Assume the quantity of purchases are false (invalid)
    for (i = 0; i < products.length; i++) { //For every product in the array, increase the length by 1
        q = POST['quantity' + i]; //q equals the quantity submitted by the user for each product
        if (isNonNegInt(q) == false) { //If the quantity entered is not an integer
            hasValidQuantities = false; //Then hasValidQuantities is false = (invalid / no products purchased)
        }
        if (q > 0) { //If the quantity (q) entered is greater than 0
            hasPurchases = true; //Then hasPurchases is true = (valid)
        }
    }
    qString = querystring.stringify(POST); //Stringing the query together
    if (hasValidQuantities == true && hasPurchases == true) { //If both hasValidQuantities & hasPurchases are true
        response.redirect("./invoice.html?" + qString); //Then redirect to the invoice page with the query entered from the form
    }
    else { //If either hasValidQuantities is false
        response.redirect("./form.html?" + qString); //Then redirect to the form again & keep the query that the user entered
    }
});

app.use(express.static('./public')); //Create a static server using express from the public folder
app.listen(8080, () => console.log(`listening on port 8080`)); //Have the server listen to port 8080 & console.log it

//Retrieved from Professor Port's Assignment 1 example (Part B)
//Create a function called checkQuantityTextbox that checks whether or not the user enters a value inside the textbox
//If there are no errors and textbox field is empty, then display 'Quantity' above the textbox
//If a valid entry of quantity is inputted, then display 'You want:' above the textbox
function isNonNegInt(q, returnErrors = false) {
    errors = []; //Assume no errors at first
    if (q == '') { q = 0 }; //Handle blank inputs as if they are 0
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); //Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value!</font>'); //Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); //Check that it is an integer
    return returnErrors ? errors : (errors.length == 0); //Return the errors made by the user OR do nothing when entry valid
}
