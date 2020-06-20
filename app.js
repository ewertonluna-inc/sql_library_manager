const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const books = require('./routes/books');
const pageNotFoudHandler = require('./middleware/pageNotFound');
const { sequelize } = require('./db/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use('/static', express.static('public'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: false}))

app.use('/', routes);
app.use('/books', books)

app.use('/', pageNotFoudHandler);

app.use(errorHandler)

sequelize.sync()
  .then(() => {
    app.listen(3000, () => console.log('Running on port 3000'))
  });