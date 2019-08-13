let User = require('../../app/common/models/user_models/user_model');
let UserRolePermission = require('../../app/common/models/user_models/user_role_permission_model');
let UserRole = require('../../app/common/models/user_models/user_role_model');

let users_initialized = async ()=> await User.estimatedDocumentCount() > 0 ? true : false;
let permissions_initialized = async ()=> await UserRolePermission.estimatedDocumentCount() > 0 ? true : false;
let roles_initialized = async ()=> await UserRole.estimatedDocumentCount() > 0 ? true : false;

//initialize permissions
if(!permissions_initialized){
    const session = async ()=> await UserRolePermission.startSession();
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
        console.log(`${result.length} UserRolePermissions Collection initialized...`);
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        console.log('[silc_server] Initialize UserRolePermissions Transaction aborted!');
		session.endSession();
		console.log(`[silc_server] Initialize UserRolePermissions ended with error: ${error}`);        
    }
}

//initialize users
// if(!users_initialized){
//     //1. load admin user schema from settings
//     let new_app_admin_user = new User({
//         first_name: req.body.first_name,
//         middle_name: req.body.middle_name,
//         last_name: req.body.last_name,
//         sex: req.body.sex,
//         email: req.body.email,
//         phone: req.body.phone,
//         address: req.body.address,
//         identification: req.body.identification,
//         membership: req.body.membership,
//         user_type: req.body.user_type,
//         date_of_birth: req.body.date_of_birth,
//         username: req.body.username,
//         password: req.body.password,
//         fcm_tokens: fcm_tokens
//     });
//     //2. create app admin user
// }