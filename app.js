const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: false}))




app.listen(3000, () => console.log('Running on port 3000'));