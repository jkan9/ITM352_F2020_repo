//Used lab 13 examples to create this server
var express = require('express'); //Run express
var data = require('./public/products.js');
var products_array = data.products;
var app = express(); //Start express
var myParser = require("body-parser"); //Require body-parser
var products = require("./public/products.js"); //Require products_data.js file
const queryString = require('querystring'); //Requrie the querystring from the form

app.all('*', function (request, response, next) { // logs method and path into console
    console.log(request.method + ' to ' + request.path); // write request to console
    next(); 
});

app.use(myParser.urlencoded({ extended: true })); // From lab 13

app.post("/process_form", function (request, response) { //POST the data from the process form
    let POST = request.body; 

    // If statement created to tell if values are positive
    if (typeof POST['purchase_submit'] != 'undefined') {
        var hasValidQuantities=true; // creating a varibale that maybe true
        var hasQuantities=false
        for (i = 0; i < products.length; i++) {
            
                        qty=POST[`quantity${i}`];
                        hasQuantities=hasQuantities || qty>0; // Checks if quantity > 0
                        hasValidQuantities=hasValidQuantities && isNonNegInt(qty);      
        } 
        // Runs this part of the if statement if all conditions are met 
        const stringified = queryString.stringify(POST);
       
        if (hasValidQuantities && hasQuantities) {
            response.redirect("./invoice.html?"+stringified); // This will use the invoice.html file
        }  
        else { 
            response.redirect("./form.html?" + stringified) // If if either hasValidQuantites is false
        }
    }
});
//Create a function called checkQuantityTextbox that checks whether or not the user enters a value inside the textbox
function isNonNegInt(q, returnErrors = false) {
    errors = []; // Assume no errors first
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); // check string number value
    if (q < 0) errors.push('Negative value!'); // check if its non-neg
    if (parseInt(q) != q) errors.push('Not an integer!'); // check if its integer
    return returnErrors ? errors : (errors.length == 0); 
}

app.use(express.static('./public')); // create static server 
app.listen(8080, () => console.log(`listening on port 8080`));  //server listen to port 8080. 