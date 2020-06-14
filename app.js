const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', routes);
app.get('/books', books);


app.listen(3000, () => console.log('Running on port 3000'));