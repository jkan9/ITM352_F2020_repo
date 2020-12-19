var express = require('express'); //must use nps install first
var app = express();
app.all('*', function (request, response, next) { //* means any path
    response.send(request.method + ' to path ' + request.path);
});
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here
