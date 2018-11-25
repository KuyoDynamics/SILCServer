module.exports = function(app, admin, app_name, logger, chalk) {

    logger(app_name,"Router","Entering Router...",chalk.green('✓'));

    // admin.use('/admin', require('./silc_api/routes/admin.router'));
    // console.log(admin.mountpath); // /admin
    
    app.use('/api/silc_groups', require('./silc_api/routes/silc/silc_groups.router'));
    app.use('/api/silc_group_members', require('./silc_api/routes/silc/silc_group_members.router'));
  }
  