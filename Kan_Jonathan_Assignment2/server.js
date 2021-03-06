//Used lab 13 examples to create this server
var data = require('./public/products.js');
var products_array = data.products;
const queryString = require('querystring'); //Requrie the querystring from the form
var express = require('express'); //Run expressvar 
var app = express(); //Start express
myParser = require("body-parser"); //Require body-parser
var user_data_filename = 'user_data.json';
var fs = require('fs'); //Load file system//
var products = require("./public/products.js"); //Require products_data.js file





// check if file exists before reading
if (fs.existsSync(user_data_filename)) {
    stats = fs.statSync(user_data_filename);
    var data = fs.readFileSync(user_data_filename, 'utf-8');
    users_reg_data = JSON.parse(data);
} 

app.all('*', function (request, response, next) { // logs method and path into console
    console.log(request.method + ' to ' + request.path); // write request to console
    next(); 
});

app.use(myParser.urlencoded({ extended: true })); // From lab 13

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    var LogError = [];
    the_username = request.body.username;
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


app.post("/process_register", function (request, response) {
  qstr = request.body
  console.log(qstr);
  var errors = [];

  if (/^[A-Za-z]+$/.test(request.body.name)) {
  }
  else {
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
  var reguser = request.body.username.toLowerCase(); 
  if (typeof users_reg_data[reguser] != 'undefined') { 
    errors.push('Username taken')
  }

  if (/^[0-9a-zA-Z]+$/.test(request.body.username)) {
  }
  else {
    errors.push('Letters And Numbers Only for Username')
  }

  //password is min 6 characters long 
  if ((request.body.password.length < 6 && request.body.username.length > 20)) {
    errors.push('Password Too Short')
  }
  // check to see if passwords match
  if (request.body.password !== request.body.repeat_password) { 
    errors.push('Password Not a Match')
  }

  if (errors.length == 0) {
     console.log('none');
     request.query.username = reguser;
     request.query.name = request.body.name;
     response.redirect('/invoice.html?' + queryString.stringify(request.query))
  }
  if (errors.length > 0) {
      console.log(errors)
      request.query.name = request.body.name;
      request.query.username = request.body.username;
      request.query.password = request.body.password;
      request.query.repeat_password = request.body.repeat_password;
      request.query.email = request.body.email;

      data = JSON.stringify(request.query.name);
        fs.writeFileSync(user_data_filename, data, "utf-8");

      request.query.errors = errors.join(';');
      response.redirect('register.html?' + queryString.stringify(request.query))
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
        //This will run when all statement pass
        const stringified = queryString.stringify(POST);
       
        if (hasValidQuantities && hasQuantities) {
            response.redirect("./login.html?"+stringified); // This will use the invoice.html file
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