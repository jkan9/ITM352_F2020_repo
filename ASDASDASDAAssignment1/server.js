var express = require('express'); //Run express
var data = require('./public/products.js');
var products_array = data.products;
var app = express(); //Start express
var myParser = require("body-parser"); //Require body-parser
var products = require("./public/products.js"); //Require products_data.js file
const queryString = require('querystring'); //Requrie the querystring from the form

app.all('*', function (request, response, next) { // this is required because i am using express to route. it will allow me to make requests
    console.log(request.method + ' to ' + request.path); // this writes the request into the console
    next(); 
});

app.use(myParser.urlencoded({ extended: true })); // setting the parser to true to deal with nested objects. (read more about what this line does on stackoverflow)

app.post("/process_form", function (request, response) {
    let POST = request.body; // Forms the data in the body

    // If statement created to determine whether or not values are positive.
    if (typeof POST['purchase_submit'] != 'undefined') {
        var hasvalidquantities=true; // creating a varibale assuming that it'll be true
        var hasquantities=false
        for (i = 0; i < products.length; i++) {
            
                        qty=POST[`quantity${i}`];
                        hasquantities=hasquantities || qty>0; // Checks if quantity is greater than 0
                        hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // Uses an and statement to return whether or not both conditions are true (not negative and greater than 0)    
        } 
        // Runs this part of the if statement if all conditions are met 
        const stringified = queryString.stringify(POST);
       
        if (hasvalidquantities && hasquantities) {
            response.redirect("./invoice.html?"+stringified); // This will use the invoice.html file
        }  
        else { 
            response.redirect("./form.html?" + stringified) // If there are no valid numbers input in the quantity, it will redirect to the products_display page.
        }
    }
});

/* Since the server is totally separate from the pages, I had to copy and paste the isNonNegInt function onto the server itself, or it would not be able to check. */
function isNonNegInt(q, returnErrors = false) {
    errors = []; // Setting up an array called errors
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); // pushes an error if the number is not an actual number
    if (q < 0) errors.push('Negative value!'); // pushes an error if it's a negative number
    if (parseInt(q) != q) errors.push('Not an integer!'); // pushes an error if it's not a whole number
    return returnErrors ? errors : (errors.length == 0); 
}

app.use(express.static('./public')); // this sets public as the root for the express node module
app.listen(8080, () => console.log(`listening on port 8080`));  //For this server it was required for us to make it listen on port 8080. 