let UserRole = require('../../models/user/user_role_model');

//GET /api/user_role_permissions/:id
async function getUserRolePermission(req, res, next) {
    try {
        let user_role_permission_id = req.params.id;
        const user_role_permission =  await UserRolePermission.findById(user_role_permission_id);
        if(user_role_permission === null){
            res.status(404);
            next( new Error('user role permission not found'));
        }
        else{
            res.status(200).send(user_role_permission);
            return;
        }
    } catch (error) {
        console.log(error);
        return next(error);        
    }
};

//POST /api/user_role_permissions
async function createUserRolePermission(req, res, next){
    const session = await UserRolePermission.startSession();
    try {
        let new_user_role_permission = new UserRolePermission({
            name: req.body.name,
            description: req.body.description
        });
        session.startTransaction();

        const ops = { session };

        await new_user_role_permission.validate();
        console.log('[metre_reader_server] User Role Permission data fields for ', new_user_role_permission._id, ' successfully passed validation!');

        const result = await new_user_role_permission.save(ops);
        console.log('[metre_reader_server] New User Role Permission with id: ', new_user_role_permission._id, ' was successfully created!');

        await session.commitTransaction();
        session.endSession();

        res.status(201).send({
            message: 'Record created successfully',
			record: result
        });
        return;

    } catch (error) {
        await session.abortTransaction();
		console.log('[metre_reader_server] Transaction aborted!');

		session.endSession();
		console.log('[metre_reader_server] Transaction ended!');
        
		res.status(422); //422 is Unprocessed Entity
		return next(error);
    }
}
module.exports = {
    getUserRolePermission,
    createUserRolePermission
}