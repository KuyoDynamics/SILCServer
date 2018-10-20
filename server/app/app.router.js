module.exports = function(app, app_name, logger, chalk) {

    logger(app_name,"Router","Entering Router...",chalk.green('✓'));
    
    app.use('/api/silc_groups', require('./silc_api/routes/silc/silc_groups.router'));
    app.use('/api/silc_group_members', require('./silc_api/routes/silc/silc_group_members.router'));
  }
  