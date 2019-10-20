const app_name = require('../../../package.json').name;
let User = require('../../app/common/models/user_models/user_model');
let UserRolePermission = require('../../app/common/models/user_models/user_role_permission_model');
let UserRole = require('../../app/common/models/user_models/user_role_model');

let users_initialized = false;
let permissions_initialized = false;
let roles_initialized = false;

async function dbInitialized(){
    users_initialized = await User.estimatedDocumentCount({}) > 0 ? true : false;
    permissions_initialized = await UserRolePermission.estimatedDocumentCount({}) > 0 ? true : false;
    roles_initialized = await UserRole.estimatedDocumentCount({}) > 0 ? true : false;
    return (users_initialized === true) && (permissions_initialized === true) && (roles_initialized === true);
}

async function initializeDb(){
    //Permissions
    if(!permissions_initialized){
        await initializePermissions();
    }
    else{
        console.log('['+app_name+'] Skipped User Permissions Collection Initialization!');
    }
    //Users
    //Roles
}

async function initializePermissions(){
    const session = await UserRolePermission.startSession();
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
            session.startTransaction();
            const ops = {session};
            let result = await UserRolePermission.insertMany(default_permissions, ops);
            await session.commitTransaction();
            permissions_initialized = true;
            console.log('['+app_name+'] '+`${result.length} UserRolePermissions Collections initialized and set as default...`);
            session.endSession();
            return;
        } catch (error) {
            await session.abortTransaction();
            console.log('['+app_name+'] Initialize UserRolePermissions Transaction aborted!');
            session.endSession();
            console.log('['+app_name+'] '+`Initialize UserRolePermissions ended with error: ${error}`); 
            return;       
        }
}
async function initializeRoles(){
    const session = await UserRole.startSession();
        try {
            let default_roles = [
                new UserRole({
                    name: "create:users",
                    description: "Create users"
                }),
                new UserRole({
                    name: "read:users",
                    description: "Read users"
                }),
                new UserRole({
                    name: "update:users",
                    description: "Update users"
                }),
                new UserRole({
                    name: "delete:users",
                    description: "Delete users"
                })
            ]
            session.startTransaction();
            const ops = {session};
            let result = await UserRole.insertMany(default_roles, ops);
            await session.commitTransaction();
            permissions_initialized = true;
            console.log('['+app_name+'] '+`${result.length} UserRoles Collections initialized and set as default roles...`);
            session.endSession();
            return;
        } catch (error) {
            await session.abortTransaction();
            console.log('['+app_name+'] Initialize UserRoles Transaction aborted!');
            session.endSession();
            console.log('['+app_name+'] '+`Initialize UserRoles ended with error: ${error}`); 
            return;       
        }
}

module.exports = {
    dbInitialized,
    initializeDb
}