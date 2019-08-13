let UserRole = require('../../models/user/user_role_model');

//GET /api/user_roles/:id
async function getUserRole(req, res, next) {
    try {
        let user_role_id = req.params.id;
        const user_role =  await UserRole.findById(user_role_id);
        if(user_role === null){
            res.status(404);
            next( new Error('user role not found'));
        }
        else{
            res.status(200).send(user_role);
            return;
        }
    } catch (error) {
        console.log(error);
        return next(error);        
    }
};

//POST /api/user_roles
async function createUserRole(req, res, next){
    const session = await UserRole.startSession();
    try {
        let new_user_role = new UserRole({
            name: req.body.name,
            description: req.body.description,
            permissions: req.body.permissions
        });
        session.startTransaction();

        const ops = { session };

        await new_user_role.validate();
        console.log('[metre_reader_server] User Role data fields for ', new_user_role._id, ' successfully passed validation!');

        const result = await new_user_role.save(ops);
        console.log('[metre_reader_server] New User Role with id: ', new_user_role._id, ' was successfully created!');

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
    getUserRole,
    createUserRole
}
