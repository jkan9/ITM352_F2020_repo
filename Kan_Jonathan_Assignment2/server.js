//Used lab 13 examples to create this server
var express = require('express'); //Run express
var data = require('./public/products.js');
var products_array = data.products;
var app = express(); //Start express
var myParser = require("body-parser"); //Require body-parser
var products = require("./public/products.js"); //Require products_data.js file
const queryString = require('querystring'); //Requrie the querystring from the form
const user_data_filename = 'user_data.json';
var fs = require('fs'); //Load file system//
app.all('*', function (request, response, next) { // logs method and path into console
    console.log(request.method + ' to ' + request.path); // write request to console
    next(); 
});

app.use(myParser.urlencoded({ extended: true })); // From lab 13


// check if file exists before reading
if (fs.existsSync(user_data_filename)) {
    stats = fs.statSync(user_data_filename);

    var data = fs.readFileSync(user_data_filename, 'utf-8');
    users_reg_data = JSON.parse(data);
}

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    var LogError = [];
    the_username = request.body.username;
    // if user exists, get their password
    if (typeof users_reg_data[request.body.username] != 'undefined') {
        if (users_reg_data[the_username].password == request.body.password) {
            request.query.username = the_username;
            console.log(users_reg_data[request.query.username].name);
            request.query.name = users_reg_data[request.query.username].name
            response.redirect('/form.html?' + queryString.stringify(request.query));
            return;
            //Redirect them to invoice here if they logged in correctly//
        } else {
            LogError.push = ('Invalid Password');
      console.log(LogError);
      request.query.username= the_username;
      request.query.name= users_reg_data[the_username].name;
      request.query.LogError=LogError.join(';');
        }
    } else {
        LogError.push = ('Invalid Username');
        console.log(LogError);
        request.query.username= the_username;
        request.query.LogError=LogError.join(';');
    }
    response.redirect('./login.html?' + queryString.stringify(request.query));
});


app.post("/register", function (request, response) {
    // process a simple register form
    console.log(request.body);
    console.log(quantity_str);
    name = request.body.name;
    username = request.body.username;
    email = request.body.email;
    password = request.body.password.toLowerCase(); // Makes password case sensitive
    repeat_password = request.body.repeat_password.toLowerCase(); // Makes repeat password case sensitive
    errs = [];
    
  // Name
  if ((request.body.name.length > 30) ==true){
    errs.push(" Please input a name with 30 characters or less."); //if length is more than 10, show username error
  }
  // Check if username is taken
  if (typeof userdata[username] != 'undefined') {
    errs.push(" Sorry! Username is already taken. Please go back and input a different one. "); //if username is not undefined, send error message that it's already taken
  } 
  if ((username.length > 10) ==true){
    errs.push(" 4-10 characters are required for username! Please make your username shorter. "); //if length is more than 10, show error to make the username shorter
  }
  if ((username.length < 4) ==true){
    errs.push(" 4-10 characters are required for username! Please make your username longer. "); //if length is less than 4, show error to make the username longer
  } 
    //is pass same as repeat pass
  if (request.body.password != request.body.repeat_password) {
    errs.push(" Sorry! The passwords you inputted do not match. Please go back and try again. "); //if passwords do not match, send error message that they don't match
  }
  if ((request.body.password.length < 6) ==true){
    errs.push(" At least 6 characters are required for password! Please make your password longer. "); //if password is less then 6 characters, send error message to make it longer
  } 
  if (errs.length == 0) { //if there are no errors, gather all the data that was entered
    userdata[username] = {};
    userdata[username].name = request.body.name
    userdata[username].password = request.body.password;
    userdata[username].email = request.body.email;
    
      fs.writeFileSync(user_info_file, JSON.stringify(userdata)); //write and save all the data to the user_data.json file
      quantityQuery_str = querystring.stringify(quantity_str); //define query string variable again
          response.redirect('./invoice.html?' + quantityQuery_str + `&username=${username}`); //then redirect customer to their invoice page with the correct product quantity (achieved by using query string)
    } else {
        response.end(JSON.stringify(errs)); //else send the errors
    }
});

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