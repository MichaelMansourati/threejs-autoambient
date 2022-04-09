const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use("/css/", express.static('css'));
app.use("/js/", express.static('js'));

// sendFile will go here
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);