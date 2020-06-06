module.exports = function(app_name, module_name, message, chalk_mark){
    console.log('['+app_name+']','From '+module_name +':', message, chalk_mark);
}