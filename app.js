const express = require('express');

const app = express();

app.get('/', function(req, res){ //requisição(req) resposta(res)
    res.write('Hellow World!');
    res.end();
});




//servidor
app.listen(8080);