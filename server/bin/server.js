const express = require('express');
const app = express();
const admin = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const path = require('path');
const app_name = require('../../package.json').name;
const morgan = require('morgan');
const logger = require('../helpers/logger');
const strings = require('../helpers/strings');
const { exec } = require('child_process');


mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));


app.use(morgan('common'));

app.all('/api/*', function(req, res, next){
  //check if connected to the db
  console.log("Mongoose connection readyState: ", mongoose.connection.readyState);
  if(mongoose.connection.readyState === 0){
    res.status(503).send('Database connection not available');
  }
  
  next();
})
//Load routes
require('../app/app.router')(app, admin, app_name, logger, chalk);

//Register Generic Error Handler
app.use(function(err,req,res,next){
  console.log('[silcserver] Error:', err.message);
  res.send({
    status: err.name,
    message: err.message,
    reason: err.reason
  })
});


const options = {
  reconnectTries: Number.MAX_VALUE,
  useNewUrlParser: true  
}

try{
  if (process.env.NODE_ENV === 'TEST') {
      var configFile = path.join(__dirname, '../config/.env');
      dotenv.load({ path: configFile });
    }
  mongoose.connect(process.env.MONGODB_URL, options);
} catch(error){
  console.log(strings.error_messages.connection_error, error.message);
}

var db_connection = mongoose.connection;

process.on('SIGINT', function(){
    db_connection.close(function(){
    console.log(strings.error_messages.connection_closed_sigint, chalk.red('X'));
    process.exit(0);
  });
});

db_connection.on('error', (error) =>{
  console.error('[' + app_name + ']', strings.error_messages.connection_error + error.message, chalk.red('X'));
});

db_connection.on('disconnected', function(){
  console.log('[' + app_name + ']', strings.error_messages.connection_closed_db_server,
  chalk.red('X'));
});

db_connection.on('connected', function(){
  console.log('[' + app_name + ']', strings.info_messages.connected_to_db_server,
  chalk.green('✓'));
});

db_connection.on('reconnectFailed', function(){
  console.log('[' + app_name + ']', strings.error_messages.connection_failed_max_retries, chalk.red('X'));
});

db_connection.on('connecting', function(){
  console.log('[' + app_name + ']', strings.info_messages.connecting_to_db_server,
  chalk.green('✓'));
});

db_connection.on('disconnecting', function(){
  console.log('[' + app_name + ']', strings.info_messages.disconnecting_from_db_server,
  chalk.red('X'));
});

let PORT = process.env.PORT || 3000;

let server = app.listen(PORT, function(){
    console.log('[' + app_name + ']', strings.info_messages.connected_to_silc_server + strings.info_messages.listening_to_silc_server + PORT + '!', chalk.green('✓'));
});

module.exports = server;