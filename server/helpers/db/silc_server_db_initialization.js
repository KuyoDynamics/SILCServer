let User = require('../../app/common/models/user_models/user_model');
let UserRolePermission = require('../../app/common/models/user_models/user_role_permission_model');
let UserRole = require('../../app/common/models/user_models/user_role_model');

let users_initialized = async ()=> await User.estimatedDocumentCount() > 0 ? true : false;
let permissions_initialized = async ()=> await UserRolePermission.estimatedDocumentCount() > 0 ? true : false;
let roles_initialized = async ()=> await UserRole.estimatedDocumentCount() > 0 ? true : false;

function dbInitialized(){
    return users_initialized && permissions_initialized && roles_initialized;
}

function initializeDb(){
    //Permissions
    if(!permissions_initialized){
        const session = async ()=> {await UserRolePermission.startSession()};
        const ops = {session};
        try {
            let default_permissions = [
                new UserRolePermission({
                    name: "create:users",
                    description: "Create users"
                }),
                new UserRolePermission({
                    name: "read:users",
                    description: "Read users"
                }),
                new UserRolePermission({
                    name: "update:users",
                    description: "Update users"
                }),
                new UserRolePermission({
                    name: "delete:users",
                    description: "Delete users"
                })
            ]
            
            let result = async ()=> await UserRolePermission.insertMany(default_permissions, ops);
            async ()=> await session.commitTransaction();
            permissions_initialized = true;
            console.log(`${result.length} UserRolePermissions Collection initialized...`);
            session.endSession();
        } catch (error) {
            async ()=> await session.abortTransaction();
            console.log('[silc_server] Initialize UserRolePermissions Transaction aborted!');
            session.endSession();
            console.log(`[silc_server] Initialize UserRolePermissions ended with error: ${error}`);        
        }
    }
}


module.exports = {
    dbInitialized,
    initializeDb
}