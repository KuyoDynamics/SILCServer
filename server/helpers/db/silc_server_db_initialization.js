const app_name = require('../../../package.json').name;
let User = require('../../app/common/models/user_models/user_model');
let UserRolePermission = require('../../app/common/models/user_models/user_role_permission_model');
let UserRole = require('../../app/common/models/user_models/user_role_model');

let users_initialized = usersInitialized();
let permissions_initialized = permissionsInitialized();
let roles_initialized = rolesInitialized();

async function usersInitialized() {
    return await User.estimatedDocumentCount({}) > 0 ? true : false;
}
async function permissionsInitialized() {
    return await UserRolePermission.estimatedDocumentCount({}) > 0 ? true : false;
}
async function rolesInitialized() {
    return await UserRole.estimatedDocumentCount({}) > 0 ? true : false;
}
async function dbInitialized() {
    return (users_initialized && permissions_initialized && roles_initialized);
}

async function initializePermissions() {
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
        const ops = { session };
        let result = await UserRolePermission.insertMany(default_permissions, ops);
        await session.commitTransaction();
        permissions_initialized = true;
        console.log('[' + app_name + '] ' + `${result.length} UserRolePermissions Collections initialized with default user role permissions...`);
        session.endSession();
        return;
    } catch (error) {
        await session.abortTransaction();
        console.log('[' + app_name + '] Initialize UserRolePermissions Transaction aborted!');
        session.endSession();
        console.log('[' + app_name + '] ' + `Initialize UserRolePermissions ended with error: ${error}`);
        return;
    }
}
async function initializeRoles() {
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
            }),
            new UserRole({
                name: "read:only",
                description: "Read only"
            })
        ]
        session.startTransaction();
        const ops = { session };
        let result = await UserRole.insertMany(default_roles, ops);
        await session.commitTransaction();
        permissions_initialized = true;
        console.log('[' + app_name + '] ' + `${result.length} UserRoles Collections initialized with default user roles...`);
        session.endSession();
        return;
    } catch (error) {
        await session.abortTransaction();
        console.log('[' + app_name + '] Initialize UserRoles Transaction aborted!');
        session.endSession();
        console.log('[' + app_name + '] ' + `Initialize UserRoles ended with error: ${error}`);
        return;
    }
}
async function initializeUsers(){
    const session = await User.startSession();
    try {
        let default_user = 
            new UserRole({
                is_default_user: true,
                first_name: "Super User",
                middle_name: "",
                last_name: "Default",
                sex: "unknown",
                email: "",
                phone: "+260974110062",
                address: "",
                identification: "",
                membership: "",
                user_roles: ["create:users","read:users","delete:users", "update:users"],
                date_of_birth: "",
                username: "super", //generate a random password and send it to the admin's email specificied via bootstrap command at startup
                password: "",
                login_attempts: "",
                lock_until: "",
                fcm_tockens: ""
            });
        
        session.startTransaction();
        const ops = { session };
        let result = await UserRole.insertOne(default_user, ops);
        await session.commitTransaction();
        users_initialized = true;
        console.log('[' + app_name + '] ' + `${result.length} Users Collections initialized with the default user...`);
        session.endSession();
        return;
    } catch (error) {
        await session.abortTransaction();
        console.log('[' + app_name + '] Initialize User Transaction aborted!');
        session.endSession();
        console.log('[' + app_name + '] ' + `Initialize User ended with error: ${error}`);
        return;
    }
}

async function bootStrapPermissions(){
    if (!permissions_initialized) {
        await initializePermissions();
    }
    else {
        console.log('[' + app_name + '] Skipped User Permissions Collection Initialization[permissions already initialized]...');
    }
}
async function bootStrapRoles(){
    if(!roles_initialized){
        if(permissions_initialized){
            await initializeRoles();
        }
        else{
            console.log('[' + app_name + '] Skipped User Role Collection Initialization[permissions not initialized]...');
        }
    }
    else{
        console.log('[' + app_name + '] Skipped User Role Collection Initialization[roles already initialized]...');
    }
}

async function bootStrapUsers(){
    if(!users_initialized){
        if(permissions_initialized && roles_initialized){
            await initializeUsers();
        }
        else{
            console.log('[' + app_name + '] Skipped User Collection Initialization[permissions or roles not initialized]...');
        }
    }
    else{
        console.log('[' + app_name + '] Skipped User Collection Initialization[users already initialized]...');
    }
}

async function initializeDb() {
    //Permissions
    await bootStrapPermissions();
    //Roles
    await bootStrapRoles();
    //Users
    await bootStrapUsers();
}

module.exports = {
    dbInitialized,
    initializeDb
}