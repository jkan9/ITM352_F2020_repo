const fs = require('fs');
const users_data_filename = 'user_data.json';

var express = require('express');
var app = express();
var myParser = require("body-parser");

if(fs.existsSync(users_data_filename)){
stats = fs.existsSync(users_data_filename);
console.log(`user_data.json has ${stats[`size`]} characters`);

var data = fs.readFileSync(users_data_filename, 'utf-8');
var users_reg_data = JSON.parse(data);
} 

app.use(myParser.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="process_login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
console.log(request.body);
if(typeof users_data_filename[request.body['username']] != 'undefined') {
    if(request.body.password == users_data_filename[request.body.username].password){
        response.send(`Thank you ${request.body.username} for logging in.`);
    }

} else {
    response.send(`Hey! ${request.body.username} does not exist!`);
}


});


app.listen(8080, () => console.log(`listening on port 8080`));



