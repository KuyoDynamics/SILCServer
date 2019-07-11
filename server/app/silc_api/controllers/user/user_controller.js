let User =  require('../models/user.model');

//GET /api/users/:id
async function getUser(req, res, next) {
    try {
        let user_id = req.params.id;
        const user =  await User.findById(user_id);
        if(user === null){
            res.status(404);
            next( new Error('user not found'));
        }
        else{
            res.status(200).send(user);
            return;
        }
    } catch (error) {
        console.log(error);
        return next(error);        
    }
};

//POST /api/users
async function createUser(req, res, next){
    const session = await User.startSession();
    try {
        let new_user = new User({
            username: req.body.username,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            sex: req.body.sex,
            date_of_birth: req.body.date_of_birth,
            user_type: req.body.user_type,
            user_permissions: req.body.user_permissions
        });
        session.startTransaction();

        const ops = { session };

        await new_user.validate();
        console.log('[metre_reader_server] User data fields for ', new_user._id, ' successfully passed validation!');

        const result = await new_user.save(ops);
        console.log('[metre_reader_server] New User with id: ', new_user._id, ' was successfully created!');

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

//POST /api/users

module.exports = {
    getUser,
    createUser
}