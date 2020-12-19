//Author: Jonathan Kan
/*Using Assignment 2 code to work on Assignment 3*/
/*used and edit code from Lab13 Ex4 and Lab14 Ex 4 (a lot of influence)*/
//Used lab 13 examples to create this server
var data = require('./public/products.js');
var products_array = data.products;
const queryString = require('querystring'); //Requrie the querystring from the form
var express = require('express'); //Run expressvar 
var app = express(); //Start express
myParser = require("body-parser"); //Require body-parser
var cookieParser = require('cookie-parser');
var user_data_filename = 'user_data.json';
var fs = require('fs'); //Load file system//
var products = require("./public/products.js"); //Require products_data.js file
var session = require('express-session'); // taken from simple_shopping_cart_example




// check if file exists before reading
if (fs.existsSync(user_data_filename)) {
    stats = fs.statSync(user_data_filename);
    var data = fs.readFileSync(user_data_filename, 'utf-8');
    users_reg_data = JSON.parse(data);
} 

app.use(myParser.urlencoded({ extended: true })); // From lab 13
app.use(session({secret: "ITM352 rocks!",resave: false, saveUninitialized: true})); //Taken from assingment3 examples


app.all('*', function (request, response, next) { // logs method and path into console
    // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
    // anytime it's used
    if(typeof request.session.cart == 'undefined') { request.session.cart = {}; } 
    next();
});

app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});
//From assignment3 sample and revised 
app.get("/set_cookie", function (request, response){
  response.cookie('myname', 'Jonathan Kan', {maxAge: 50*1000}).send('cookie set');

});

app.get("/use_cookie", function (request, response){
  output = "No cookie with myname";
  if(typeof request.cookies.myname != 'undefined'){
      output = `Welcome to the Use Cookie page ${request.cookies.myname}`;
  }
  response.send(output);
});

app.get('/use_session', function(request, response){
  response.send(`welcome, your session ID is ${request.session.id}`);

});


app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    var LogError = []; //Object for errors
    the_username = request.body.username; // Assign variable to input data
    // if user exists, get their password from user_data
    if (typeof users_reg_data[request.body.username] != 'undefined') {
        if (users_reg_data[the_username].password == request.body.password) {
            request.query.username = the_username;
            console.log(users_reg_data[request.query.username].name);
            request.query.name = users_reg_data[request.query.username].name
            response.redirect('/invoice.html?' + queryString.stringify(request.query));
            return;
            //Redirect them to invoice here if they logged in correctly//
        } else { //tell user password is invalid and redirect them back to login
            LogError.push = ('Invalid Password');
      console.log(LogError);
      request.query.username= the_username;
      request.query.name= users_reg_data[the_username].name;
      request.query.LogError=LogError.join(';');
        }
    } else {//tell user username is invalid and redirect them back to login
        LogError.push = ('Invalid Username');
        console.log(LogError);
        request.query.username= the_username;
        request.query.LogError=LogError.join(';');
    }
    response.redirect('./login.html?' + queryString.stringify(request.query));
});

app.get("/cart.html", function (request, response) {
  cartfile = `<script> var cart = ${JSON.stringify(request.session)}</script>`;
  cartfile += fs.readFileSync('./public/cart.html', 'utf-8'); // add it onto the cart page which is in public
  response.send(cartfile);

});

// Display registration page from the login
app.post("/process_register", function (request, response) {
  console.log(request.body);
  //variable for re-enter password validation
  var typepassword = request.body.password;
  var copypassword = request.body.repeat_password;

  var username = request.body.username; //save new user to file name (users_reg_data)
  var username = request.body.username.toLowerCase(); //makes username case insensitive
  qstr = request.body;
  console.log(qstr);
  var errors = {};

  fullname = request.body.fullname;//save new user to file name (users_reg_data)
  //fullname validation
  if ((/[a-zA-Z]+[ ]+[a-zA-Z]+/).test(request.body.name) == false) {
  }
  else { //Error if fields are left empty
    errors.push('Use Letters Only for Full Name')
  }
  // validating name
  if (request.body.name == "") {
    errors.push('Invalid Full Name');
  }
  // the length of full name is less than 25
  if ((request.body.fullname.length > 25)) {
    errors.push('Full Name Too Long')
  }
  //  the length of full name is btwn 0 & 20 
if ((request.body.fullname.length > 20 && request.body.fullname.length <0)) {
  errors.push('Full Name Too Long')
}

  if (typeof users_reg_data[username] != 'undefined') { 
    errors.push('Username taken')
  }

  if (/^[0-9a-zA-Z]+$/.test(request.body.username) == false) {
    errors.username_error.push("Numbers and Letters only"); // will show error message if there are special symbols
  }
  if ((username.length > 10) == true) {
    errors.username_error.push("10 characters max"); //will show error message if characters is longer than 10 digit
}
if ((username.length < 4) == true) {
    errors.username_error.push("4 characters minimmum"); //will show error message if characters is shorter than 4 digit
}

password = request.body.password;
//password length validation 
if ((password.length < 6) == true) {
    errors.password_error = "Password is too short - 6 characters minimmum"; //will show error message if number of characters is shorter than 6 
}
  // check to see if passwords match
  if (request.body.password !== request.body.repeat_password) { 
    errors.password_error = ('Password does not Match')
  }

  email = request.body.email;
  //email validation
  if ((/[a-z0-9._]+@[a-z0-9]+\.[a-z]+/).test(request.body.email) == false) {
      errors.email_error = "Please enter an another email"; //will show error message if proper email is not used )
  }

  console.log(errors, users_reg_data);
  //if there are 0 errors and repeat_password is equal to password, request all registration info
  if ((Object.keys(errors).length == 0) & (typepassword == copypassword)) {
      users_reg_data[username] = {};
      users_reg_data[username].username = request.body.username
      users_reg_data[username].password = request.body.password;
      users_reg_data[username].email = request.body.email;
      users_reg_data[username].fullname = request.body.fullname;

      data = JSON.stringify(users_reg_data);
      fs.writeFileSync(user_data_filename, data, "utf-8"); //saves and writes registaration data into the user_data file
      console.log(`saved`)
    
      response.redirect("/invoice.html?" + queryString.stringify(request.query)); //if all good, send to invoice
  } else {
      qstring = qs.stringify(request.body) + "&" + qs.stringify(errors); //puts errors into a query string
      response.redirect('/register.html?' + qstring.stringify(request.query)); //if there are any errors, it will send user back to register page
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
      //This will run when all statement are correct 
      const stringified = queryString.stringify(POST);
     
      if (hasValidQuantities && hasQuantities) {
          response.redirect("./login.html?"+stringified); // This will use the invoice.html file
      }  
      else { 
          response.redirect("./invoice.html?" + stringified) // If if either hasValidQuantites is false
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