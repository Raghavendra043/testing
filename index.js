const express = require('express');
const dotenv = require('dotenv')
const routes = require('./routes/index');

const app = express();

var cors = require('cors')
var bodyParser = require('body-parser');

dotenv.config();

app.use(express.static(__dirname + "/"));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cors())

app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded({ extended: true }));

app.set('host', process.env.HOST || 'http://localhost');
app.set('port', process.env.PORT || 9000);

app.use(routes);

app.listen(app.get('port'), () => {
  console.log('info', `App is running at ${app.get('host')}:${app.get('port')}`);
});

module.exports = app;