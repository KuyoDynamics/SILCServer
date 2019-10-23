const app_name = require('../../../package.json').name;
let User = require('../../app/common/models/user_models/user_model');
let UserRolePermission = require('../../app/common/models/user_models/user_role_permission_model');
let UserRole = require('../../app/common/models/user_models/user_role_model');

let users_initialized;
let permissions_initialized;
let roles_initialized;

async function usersInitialized() {
    let user_count = await User.estimatedDocumentCount({});
    return (user_count > 0);
}
async function permissionsInitialized() {
    let permission_count = await UserRolePermission.estimatedDocumentCount({});
    return (permission_count > 0);
}
async function rolesInitialized() {
    let role_count = await UserRole.estimatedDocumentCount({});
    return (role_count > 0);
}
async function dbInitialized() {
    [users_initialized, permissions_initialized, roles_initialized] = await Promise.all([usersInitialized(), permissionsInitialized(), rolesInitialized()]);
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
async function initializeUsers() {
    const session = await User.startSession();
    try {
        //1. Should the bootstrap query some remote service?
        //2. Should the bootstrap query SILC Server for stored bootstrap key?
        //3. Should the bootstrap save the admin email to local storage, then share password with user via email?
        //4. Password and email should be encrypted
        let default_user =
            new UserRole({
                is_default_user: true,
                first_name: "Super User",
                middle_name: "",
                last_name: "Default",
                sex: "unknown",
                email: "",//set this to email used during bootstrap
                phone: "",
                address: "",
                identification: "",
                membership: "",
                user_roles: ["create:users", "read:users", "delete:users", "update:users"],
                date_of_birth: "",
                username: "super", //generate a random password and send it to the admin's email specificied via bootstrap command at startup
                password: "",
                login_attempts: "",
                lock_until: "",
                fcm_tockens: ""
            });

        session.startTransaction();
        const ops = { session };
        let result = await default_user.save(ops);
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

async function bootStrapPermissions() {
    if (!permissions_initialized) {
        await initializePermissions();
    }
    else {
        console.log('[' + app_name + '] Skipped User Permissions Collection Initialization[permissions already initialized]...');
    }
}
async function bootStrapRoles() {
    if (!roles_initialized) {
        if (permissions_initialized) {
            await initializeRoles();
        }
        else {
            console.log('[' + app_name + '] Skipped User Role Collection Initialization[permissions not initialized]...');
        }
    }
    else {
        console.log('[' + app_name + '] Skipped User Role Collection Initialization[roles already initialized]...');
    }
}
async function bootStrapUsers() {
    console.log('users_initialized from bootStrapUsers: ' + users_initialized);
    if (!users_initialized) {
        if (permissions_initialized && roles_initialized) {
            await initializeUsers();
        }
        else {
            console.log('[' + app_name + '] Skipped User Collection Initialization[permissions or roles not initialized]...');
        }
    }
    else {
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