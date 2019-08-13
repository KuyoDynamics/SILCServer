module.exports = function(app, admin, app_name, logger, chalk) {
    app.use('/silc/api/users',require('./user/user_router'));
    app.use('/silc/api/auth/login', require('./user/login_router')); 
    app.use('/silc/api/auth/token', require('./user/token_renew_router'));    
	app.use('/silc/api/silc_groups', require('../../../silc_api/routes/silc/silc_groups_router'));
	app.use('/silc/api/silc_group_members', require('../../../silc_api/routes/silc/silc_group_members_router'));
};
  