const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
let {require_authentication} = require('../helpers/authentication/authentication_manager');
const strings = require('../helpers/strings');
const app_name = require('../../package.json').name;
global.app = express();
mongoose.set('useCreateIndex', true);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../public')));
app.use(morgan('common'));
//Set req.user to null for each server request
app.use('*', function(req, res, next){
	req.user = null;
	next();
});
app.all('/api/*', require_authentication,function(req, res, next){
	//check if connected to the db
	console.log('Mongoose connection readyState: ', mongoose.connection.readyState);
	if(mongoose.connection.readyState === 0){
		res.status(503).send('Database connection not available');
	}
	next();
});
//Load routes
require('../app/app_router');
const options = {
	autoReconnect: true,
	reconnectTries: Number.MAX_VALUE,
	useNewUrlParser: true,
	bufferMaxEntries: 0 ,
	bufferCommands: false 
};

try{
	if (process.env.NODE_ENV === 'TEST') {
		var configFile = path.join(__dirname, '../config/.env');
		dotenv.load({ path: configFile });
	}
} catch(error){
	
	console.log(strings.error_messages.connection_error, error.message);
}
//Initialize FCM
require('../helpers/fcm/fcm_manager').fcmInit()
	.then((result)=>{
		console.log('[' + app_name + ']', `[FCM App Name: ${result.name}] initialized successfully...`);
	})
	.catch((error)=>{
		console.log('[' + app_name + ']', 'FCM Error:',error);
	});

var db_connection = mongoose.connection;
db_connection.setMaxListeners(0);
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

db_connection.on('timeout', function(){
	console.log('Timeout...');
});

mongoose.connect(process.env.MONGODB_URL, options);
app.use(function(err,req,res,next){
	console.log('[metrereaderserver] Error:', err.message + '\n Stack Trace: ' + err.stack);

	res.json({
		status: err.status === null ? 404 : err.status,
		message: err.message === null ? 'Not found' : err.message
	}).send().end();
	console.log('Called global error handler');
});
let PORT = process.env.PORT || 3000;

let server = app.listen(PORT, function(){
	console.log('[' + app_name + ']', strings.info_messages.connected_to_silc_server + strings.info_messages.listening_to_silc_server + PORT + '!', chalk.green('✓'));
});

module.exports = server;