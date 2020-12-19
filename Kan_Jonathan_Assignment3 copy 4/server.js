//Author: Jonathan Kan
/*Using Assignment 2 code to work on Assignment 3*/
/*used and edit code from Lab13 Ex4 and Lab14 Ex 4 (a lot of influence)*/
//Used lab 13 examples to create this server
//Got help from Megan Nagai and Mark Ushiroda

var data = require('./public/product_data.js'); //load products_data.js file and set to variable 'data'
var allProducts = data.allProducts; //set variable 'allProducts' to the products_data.js file
const queryString = require('querystring'); //read variable 'query-string' as the loaded query-string module
var express = require('express'); //load and cache express module
var app = express(); //set module to variable 'app'
var myParser = require("body-parser"); //load and cache body-parser module
var fs = require('fs'); // load and cache fs module
var user_info_file = './user_data.json'; // making the .json file to the variable 'user_info_file'
var userdata_file = fs.readFileSync(user_info_file, 'utf-8'); //open file user_data.json and assign it from userdata to a string variable
userdata = JSON.parse(userdata_file); //convert string into json object
var cookieParser = require('cookie-parser'); // assigns cookieParser variable to require cookie-parser 
app.use(cookieParser());
//decode json post data
app.use(myParser.json());
//load session
var session = require('express-session'); // assigns session variable to require express-session 
app.use(session({ secret: "ITM352 rocks!" }));
const nodemailer = require("nodemailer");
// check if file exists before reading
if (fs.existsSync(user_info_file)) {
  stats = fs.statSync(user_info_file);
  var data = fs.readFileSync(user_info_file, 'utf-8');
  users_reg_data = JSON.parse(data);

}

app.use(myParser.urlencoded({ extended: true })); // From lab 13


app.all('*', function (request, response, next) { // logs method and path into console
  // need to initialize an object to store the cart in the session. We do it when there is any request so that we don't have to check it exists
  // anytime it's used
  if (typeof request.session.cart == 'undefined') { request.session.cart = {}; }
  next();
});

app.all('*', function (request, response, next) {
  console.log(request.method + ' to ' + request.path);
  next();
});

//The following was taken from stormpath.com and Lab15 ex4.js
app.use(session({ //
  secret: 'ITMRocks!', //random string to encrypt session ID
  resave: true, //save session
  saveUninitialized: false, //forget session after user is done
  httpOnly: false, //allows browser js from accessing cookies
  secure: true, //ensures cookies are only used over HTTPS
  ephemeral: true // deletes cookie when browser is closed
}));

app.post("/process_login", function (request, response) {
  // Process login form POST and redirect to logged in page if ok, back to login page if not
  console.log(request.body);
  var LogError = []; //Object for errors
  login_username = request.body.username; // Assign variable to input data
  // if user exists, get their password from user_data
  if (typeof users_reg_data[request.body.username] != 'undefined') {
    console.log(request.body.password)
        console.log(request.body.username)
    if (users_reg_data[login_username].password == request.body.password) {
     //create cookie for username
     response.cookie('username', `${request.body.username}`, { maxAge: 6000 * 1000 })
     var user = users_reg_data[request.body.username];
     console.log(user.email)
     //create cookie for email
     response.cookie('email', `${user.email}`)

     //redirect to cart
     response.redirect('./index.html?');
      if (Object.keys(LogError).length == 0) { //If no errors
        //the following was taken from Lab15 ex4.js
        session.username = login_username; //add username to user's session
        var theDate = Date.now(); //sets the time of login
        session.last_login_time = theDate; //remember this login time in session
        var login_name = users_reg_data['name']; //set login name to the name saved for user
        var user_email = users_reg_data['email']; //set email to the email saved for user
        response.cookie('username', login_username) //gives username in cookie
        response.cookie('name', login_name) //gives name in cookies
        response.cookie('email', user_email); //gives a cookie to user
        response.json({}); //give response parsed as json object
      } else {
        response.json(errs); //otherwise, show error message
      }
      //Redirect them to invoice here if they logged in correctly//

    }
    else { //tell user password is invalid and redirect them back to login
      LogError.push = ('Invalid Password');
      console.log(LogError);
      request.query.username = login_username;
      request.query.name = users_reg_data[login_username].name;
      request.query.LogError = LogError.join(';');
    }
  } else {//tell user username is invalid and redirect them back to login
    LogError.push = ('Invalid Username');
    console.log(LogError);
    request.query.username = login_username;
    request.query.LogError = LogError.join(';');
  }
  response.redirect('./login.html?' + queryString.stringify(request.query));
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
  if ((request.body.fullname.length > 20 && request.body.fullname.length < 0)) {
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
    fs.writeFileSync(user_info_file, data, "utf-8"); //saves and writes registaration data into the user_data file
    console.log(`saved`)

    response.redirect("/login.html?" + queryString.stringify(request.query)); //if all good, send to invoice
  } else {
    qstring = qs.stringify(request.body) + "&" + qs.stringify(errors); //puts errors into a query string
    response.redirect('/register.html?' + qstring.stringify(request.query)); //if there are any errors, it will send user back to register page
  }
});



app.post("/process_form", function (request, response) { //POST the data from the process form
  let POST = request.body;

  // If statement created to tell if values are positive
  if (typeof POST['addProducts${i}'] != 'undefined') {
    var hasValidQuantities = true; // creating a varibale that maybe true
    var hasQuantities = false
    for (i = 0; i < `${(products_array[`type`][i])}`.length; i++) {

      qty = POST[`quantity_textbox${i}`];
      hasQuantities = hasQuantities || qty > 0; // Checks if quantity > 0
      hasValidQuantities = hasValidQuantities && isNonNegInt(qty);
    }
    //This will run when all statement are correct 
    const stringified = queryString.stringify(POST);

    if (hasValidQuantities && hasQuantities) {
      response.redirect("./login.html?" + stringified); // This will use the invoice.html file
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

app.post("/generateInvoice", function (request, response) { //help by Mark Ushiroda
  cart = JSON.parse(request.query['cartData']); //cart = parsed cartData
  cookie = JSON.parse(request.query['cookieData']); // cookie = parsed cookieData
  var theCookie = cookie.split(';'); //divide cookie
  for (i in theCookie) {
    //function taken from stackoverflow.com
    function split(theCookie) { //split the cookie before the =
      var i = theCookie.indexOf("="); //everything before the =

      if (i > 0)
        return theCookie.slice(0, i);//cut off the rest of the string after =
      else {
        return "";
      }
    };

    var key = split(theCookie[i]); //key = string before =

    if (key == ' username') { //set to theUsername 
      var theUsername = theCookie[i].split('=').pop(); //sets variable for username in cookie
    };

    if (key == 'email') { //set email
      var email = theCookie[i].split('=').pop(); //sets variable 'email'
    };

  }
  console.log(email);
  console.log(theUsername);
  console.log(theCookie);

  //create a string with the invoice then email it to user and send back to cart for displaying on the browser (the below code is copied from invoice.html)

  str = `<link href="./product-style.css" rel="stylesheet">
  <header align="center">
  <!-- Center header on page -->
  <hr /> <!-- Title of page -->
  </header>
      <h3 align="center">Thank you, <font color="black">${theUsername}!</font><br />An email has been sent to <font color="black">${email}</font></h3>
  
      <style>
      /* Retrieved from Sparksuite's GitHub. website and edited:  https://github.com/sparksuite/simple-html-invoice-template/blob/master/invoice.html*/ 
      .invoice-box {
          max-width: 1000px;
          margin: auto;
          padding: 30px;
          border: 1px solid rgb(29, 27, 27);
          box-shadow: 0 0 10px rgba(0, 0, 0, .15);
          font-size: 16px;
          line-height: 30px;
          font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
          color: rgb(24, 22, 22);

      }

      .invoice-box table {
          width: 100%;
          line-height: inherit;
          text-align: left;
      }

      .invoice-box table td {
          padding: 5px;
          vertical-align: top;
          border: 1px solid rgb(29, 27, 27);
      }

      .invoice-box table tr td:nth-child(2) {
          text-align: right;
      }

      .invoice-box table tr.top table td {
          padding-bottom: 20px;
      }

      .invoice-box table tr.top table td.title {
          font-size: 45px;
          line-height: 45px;
          color: #333;
          text-align: center;
      }

      .invoice-box table tr.heading td {
          background: #eee;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
      }

      .invoice-box table tr.details td {
          padding-bottom: 20px;
          
      }

      .invoice-box table tr.item td {
          border-bottom: 1px solid #eee;
          color: rgb(67, 2, 2);
      }

      .invoice-box table tr.item.last td {
          border-bottom: none;
  
      }

      .invoice-box table tr.total td:nth-child(2) {
          border-top: 2px solid #eee;
          font-weight: bold;
      }

      @media only screen and (max-width: 600px) {
          .invoice-box table tr.top table td {
              width: 100%;
              display: block;
              text-align: center;
          }

      }

      /** RTL **/
      .rtl {
          direction: rtl;
          font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      }

      .rtl table {
          text-align: right;
      }

      .rtl table tr td:nth-child(2) {
          text-align: left;
      }
  </style>
</head>

<body>
  <div class="invoice-box">
      <table cellpadding="1" cellspacing="0">
          <tr class="top">
              <td colspan="4">
                  <table>
                      <tr>
                          <td class="title"><br>
                              <h1 style="width:100%; max-width:3000px;">Thank you!</h1>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>

          <tr class="heading">
              
              <td width="40%">Items</td>
              <td width="20%">Quantity</td>
              <td width="30%">Price</td>
              <td width="0%">Extended Price</td>

          </tr>

          <tr class="item">
          `;
  subtotal = 0; //subtotal starts off as 0
  for (product in allProducts) {
    for (i = 0; i < allProducts[product].length; i++) {

      qty = cart[`${product}${i}`];
      if (qty > 0) { //if there is a quantity entered in the textbox
        extended_price = qty * allProducts[product][i].price //extended price equation
        subtotal += extended_price; //adding extended price for each product to the subtotal

        str += `
                  <tr>
                      <td align="center" width="43%"><font color="#000000">${allProducts[product][i].name}</font></td>
                      <td align="center" width="11%"><font color="#000000">${qty}</font></td>
                      <td align="center" width="13%"><font color="#000000">\$${allProducts[product][i].price}</font></td>
                      <td align="center" width="54%"><font color="#000000">\$${extended_price}</font></td>
                  </tr>
              `;

      }

    }

  }

  // Tax
  var tax_rate = 0.0575;
  var tax = tax_rate * subtotal;

  // Shipping
  if (subtotal <= 50) {
    shipping = 2;
  }
  else if (subtotal <= 100) {
    shipping = 5;
  }
  else {
    shipping = 0.05 * subtotal; // 5% of subtotal
  }
  // Compute grand total
  var total = subtotal + tax + shipping;

  str += `
          <tr>
              <!-- Creates row of space -->
              <td colspan="4" width="100%">&nbsp;</td>
          </tr>
          <tr>
              <!-- Sub-total row -->
              <td style="text-align: center;" colspan="3" width="67%"><b>SUB-TOTAL</b></td>
              <td align="center" width="54%"><b>$
                      ${subtotal}</b> <!-- input calculated subtotal amount -->
              </td>
          </tr>
          <tr>
              <!-- Tax row -->
              <td style="text-align: center;" colspan="3" width="67%"><b><span>TAX @
                          ${100 * tax_rate}%</span></b>
              </td>
              <td align="center" width="54%"><b>$
                      ${tax.toFixed(2)}</b>
                  <!-- Input calculated amount for tax, to two decimal places-->
              </td>
          </tr>
          <tr>
          <td  colspan="3" width="67%"><strong style=color:black>Shipping</td>
          <td width="54%">${shipping.toFixed(2)}</strong></td>
          </tr>
          <tr>
              <!-- Total row -->
              <td style="text-align: center;" colspan="3" width="67%">
                  <h3 style=color:black>Total</h3>
              </td>
              <td style="text-align: center;" width="54%"><strong style=color:black>$
                      ${total.toFixed(2)}</strong>
                  <!-- Input calculated total, to two decimal places -->
              </td>
          </tr>
      </tbody>
  </table>`;

  //this code was from nodemailer.com
  var transporter = nodemailer.createTransport({ //variable for transporter
    host: 'mail.hawaii.edu', //hawaii.edu USE HAWAII EMAIL
    port: 25,
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  });
  var mailOptions = {
    from: 'jkan@hawaii.edu', //sender is jkan9@hawaii.edu
    to: email, //fetch email from the cookie from cart.html 
    subject: 'Invoice',
    html: str //the above string will return as html in the body of the email
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) { //if errors, sent to console
      console.log(error);
    } else { //notify when the email is sent successfully
      console.log('Email sent: ' + info.response);
    }
  });

  // string goes to be displayed in browser
  response.send(str);
});


//The below code was taken from stormpath.com
app.post('/logout', function (request, response) {
  request.session.reset(); //clears session
  response.redirect('/index.html'); //redirect user to index page
});


app.use(express.static('./public')); // create static server 
app.listen(8080, () => console.log(`listening on port 8080`));  //server listen to port 8080. 