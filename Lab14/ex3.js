var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var filename = "user_data.json";

app.use(myParser.urlencoded({ extended: true }));
if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, 'utf-8'); // 'utf-8' makes data readable to user
    //console.log("Success! We got: " + data)

    user_data = JSON.parse(data);
    console.log("User_data=", user_data);
    username = 'newuser'
    user_data[username] = {};
    user_data[username].name = "John Sam";
    user_data[username].password = "pass";
    user_data[username].email = "John@gmail.com";
    //wrtie updated object to user_data

    reg_info_str = json.stringify(user_data)
    fs.writeFileSync(user_data, reg_info_str);
} else {
    console.log("Sorry can't read file " + filename);
}

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
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
    // if user exists, get their password
    if (typeof user_data[request.body.username] != 'undefined') {
        if (request.body.password == user_data[request.body.username].password) {
            response.send(`Thank you ${request.body.username} for logging in.`);
        } else {
            response.send(`Hey! ${request.body.password} does not match what we have for you!`);
        }
    } else {
        response.send(`Hey! ${request.body.username} does not exist!`);
    }

});

app.listen(8080, () => console.log(`listening on port 8080`));