module.exports = function(app, admin, app_name, logger, chalk) {
    app.use('/silc/api/users',require('../user_routes/user_router'));
    app.use('/silc/api/auth/login', require('../user_routes/login_router')); 
    app.use('/silc/api/auth/token', require('../user_routes/token_renew_router'));
    app.use('/silc/api/user_roles', require('../user_routes/user_role_router'));
    app.use('/silc/api/user_role_permissions', require('../user_routes/user_role_permission_router'));
};
  