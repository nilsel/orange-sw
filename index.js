var express = require('express');
var app = express();

app.use(express.static('.'));

var poort = process.env.PORT || 3000;
app.listen(poort);

console.log('Server started on port ' + poort);