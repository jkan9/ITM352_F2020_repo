//Creating a server via express//

var data = require('./public/product_data.js'); //get the data from product_data.js
var products = data.products;

// So it'll load querystring// 
const queryString = require('query-string'); // so it'll load querystring// 
var filename = 'user_data.json'; // new//
var fs = require('fs'); //Load file system//

var express = require('express'); //Server requires express to run//
var app = express(); //Run the express function and start express//
var myParser = require("body-parser");

if (fs.existsSync(filename)) {
    stats = fs.statSync(filename) //gets stats from file
    console.log(filename + 'has' + stats.size + 'characters');

    data = fs.readFileSync(filename, 'utf-8');
    users_reg_data = JSON.parse(data);
} else { 
    console.log(filename + 'does not exist!');
}
// Go to invoice if quantity values are good, if not redirect back to order page//
//new//
// means any path //
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path)
    next();
});

app.use(myParser.urlencoded({ extended: true })); //get data in the body//
//to process the response from what is typed in the form//

// login stuff starts here , add more comments and reference// 
app.post("/process_login", function (req, res) {
    var LogError = [];
    console.log(req.query);
    the_username = req.body.username.toLowerCase();
    if (typeof users_reg_data[the_username] != 'undefined') {
        //Asking object if it has matching username, if it doesnt itll be undefined.
        if (users_reg_data[the_username].password == req.body.password) {
            req.query.username = the_username;
            console.log(users_reg_data[req.query.username].name);
            req.query.name = users_reg_data[req.query.username].name
            res.redirect('/form.html?' + queryString.stringify(req.query));
            return;
            //Redirect them to invoice here if they logged in correctly//
        } else {
            LogError.push = ('Invalid Password');
      console.log(LogError);
      req.query.username= the_username;
      req.query.name= users_reg_data[the_username].name;
      req.query.LogError=LogError.join(';');
        }
    } else {
        LogError.push = ('Invalid Username');
        console.log(LogError);
        req.query.username= the_username;
        req.query.LogError=LogError.join(';');
    }
    res.redirect('./login.html?' + queryString.stringify(req.query));
});

app.post("/process_register", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];

    if (/^[A-Za-z]+$/.test(req.body.name)) {
    }
    else {
      errors.push('Use Letters Only for Full Name')
    }
    // validating name
    if (req.body.name == "") {
      errors.push('Invalid Full Name');
    }
    // length of full name is less than 30
    if ((req.body.fullname.length > 30)) {
      errors.push('Full Name Too Long')
    }
    // length of full name is between 0 and 25 
  if ((req.body.fullname.length > 25 && req.body.fullname.length <0)) {
    errors.push('Full Name Too Long')
  }

    var reguser = req.body.username.toLowerCase(); 
    if (typeof users_reg_data[reguser] != 'undefined') { 
      errors.push('Username taken')
    }

    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else {
      errors.push('Letters And Numbers Only for Username')
    }
  
    //password is min 8 characters long 
    if ((req.body.password.length < 8 && req.body.username.length > 20)) {
      errors.push('Password Too Short')
    }
    // check to see if passwords match
    if (req.body.password !== req.body.repeat_password) { 
      errors.push('Password Not a Match')
    }

    if (errors.length == 0) {
       console.log('none');
       req.query.username = reguser;
       req.query.name = req.body.name;
       res.redirect('/Invoice.html?' + queryString.stringify(req.query))
    }
    if (errors.length > 0) {
        console.log(errors)
        req.query.name = req.body.name;
        req.query.username = req.body.username;
        req.query.password = req.body.password;
        req.query.repeat_password = req.body.repeat_password;
        req.query.email = req.body.email;

        req.query.errors = errors.join(';');
        res.redirect('register.html?' + queryString.stringify(req.query))
    }
});



app.post("/process_purchase", function (request, response) {
    let POST = request.body; // data would be packaged in the body//
  console.log(POST);
    if (typeof POST['submitPurchase'] != 'undefined') {
        var hasvalidquantities=true; // creating a varibale assuming that it'll be true// 
        var hasquantities=false
        for (i = 0; i < products.length; i++) {
            
                        qty=POST[`quantity${i}`];
                        hasquantities=hasquantities || qty>0; // If it has a value bigger than 0 then it is good//
                        hasvalidquantities=hasvalidquantities && isNonNegInt(qty);    // if it is both a quantity over 0 and is valid//     
        } 
        // if all quantities are valid, generate the invoice// 
        const stringified = queryString.stringify(POST);
        if (hasvalidquantities && hasquantities) {
            response.redirect("./login.html?"+stringified); // using the login.html and all the data that is input//
        }  
        else {response.send('Enter a valid quantity!')} 
    }
});

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume that quantity data is valid 
    if (q == "") { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); //check if value is a number
    if (q < 0) errors.push('Negative value!'); //check if value is a positive number
    if (parseInt(q) != q) errors.push('Not an integer!'); //check if value is a whole number
    return returnErrors ? errors : (errors.length == 0);
}
app.use(express.static('./public')); //Creates a static server using express from the public folder
app.listen(8080, () => console.log(`listen on port 8080`))
