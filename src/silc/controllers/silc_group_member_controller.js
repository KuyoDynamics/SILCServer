let SILCGroupMember = require( '../../models/silc/silc_group_member.model');
let SILCGroup = require('../../models/silc/silc_group_model');

/**
 * Create a new SILCGroup Member record
 * 
 * Main outer API for creating a single SILCGroup Member record
 * @public
 * @example
 * POST api/silc_group_members/
 * req.body = {
 *   "silc_groups": [
 *       "5bdf0d451231a14d0c86704d"
    ],
 *   "_id": "5bdf103276ce642bb8b268c3",
 *   "first_name": "Mulenga",
 *   "last_name": "Chaiwa",
 *   "middle_name": "Bwalya",
 *   "sex": "male",
 *   "phone": "+260974710133",
 *   "email": "chaiwa-berian-e1b1a@gmail.com",
 *   "identification": {
 *       "_id": "5bdf103276ce642bb8b268c4",
 *       "id_type": "national_id",
 *       "id_value": "129047/52/1"
 *   }
 * }
 * @param {*} req incoming http request
 * @param {*} res http server response
 * @param {*} next the next express middleware in the pipeline
 * @function
 * @returns {*} Object which can either be an error or newly created record
 */
async function createSILCGroupMember(req, res, next){

	const silc_group_member = new SILCGroupMember({
		silc_groups: req.body.silc_groups,
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		middle_name: req.body.middle_name,
		sex: req.body.sex,
		phone: req.body.phone,
		email: req.body.email,
		identification: req.body.identification
	});

	const session = await SILCGroupMember.startSession();

	try {
		session.startTransaction();

		const ops = { session };

		await silc_group_member.validate();
		console.log('[silcserver] SILC Group Member data fields for ', silc_group_member._id, ' successfully passed validation!');

		await SILCGroup.updateMany({ _id: { $in: silc_group_member.silc_groups }},{ $addToSet: { members: silc_group_member._id }}, ops);
		console.log('[silcserver] SILC Groups for ', silc_group_member._id, ' were successfully updated!');

		const result = await silc_group_member.save(ops);
		console.log('[silcserver] New SILC Group Member with id: ', silc_group_member._id, ' was successfully created!');

		await session.commitTransaction();
		session.endSession();

		res.status(201).send({
			message: 'Record created successfully',
			record: result
		});
		return;
	} catch (error) {
		await session.abortTransaction();
		console.log('[silcserver] Transaction for creating a new SILC Group Member aborted!');

		session.endSession();
		console.log('[silcserver] Transaction  for creating a new SILC Group Member ended!');
        
		res.status(422); //422 is Unprocessed Entity
		return next(error);
	};
};

/**
 * Partially update the SILCGroup Member details
 * 
 * Main outer API for updating a single SILCGroup Member details.It can also
 * be used to update the member's SILCGroup
 * @public
 * @example
 * PATCH api/silc_group_members/:id
 * req.body = {
 *  "first_name": "Berian"
 * }
 * @function
 * @param {*} req incoming http request
 * @param {*} res http server response
 * @param {*} next next middleware in the pipeline
 * @returns {*} Object which can either be an error or updated record
 */
async function partialUpdateSILCGroupMember(req, res, next){
	console.log('Params: ', req.params);
	console.log('Body: ', req.body);

	if(Object.keys(req.body).length === 0){
		res.status(422);
		return next(new Error('Cannot process empty request body'));
	};

	const session = await SILCGroupMember.startSession();

	try {
		session.startTransaction();

		const ops = { session, new:true, runValidators: true, context: 'query' };
		const result = await SILCGroupMember.findOneAndUpdate({_id: req.params.id}, req.body, ops);
		if(!result){
			throw new Error('SILC Group Member record could not be found: ' + req.params.id);
		}
		await session.commitTransaction();
		session.endSession();

		res.status(200).send({
			message: 'Record updated successfully',
			record: result
		});
		return;
	} catch (error) {
		await session.abortTransaction();
		console.log('[silcserver] Update SILC Group Member Transaction aborted!');

		session.endSession();
		console.log('[silcserver] Update SILC Group Member Transaction ended!');
        
		res.status(422); //422 is Unprocessed Entity
		return next(error);
	};
};

/**
 * GET a Single SILCGroup Member by Id
 * 
 * Main outer API for getting a single SILCGroup Member record.It can also
 * be used to filter out the fields that get returned if passed filter parameters
 * @public
 * @example
 * GET api/silc_group_members/:id
 * OR
 * GET api/silc_group_members/:id?fields=[first_name,last_name]
 * }
 * @function
 * @param {*} req incoming http request
 * @param {*} res http server response
 * @param {*} next next middleware in the pipeline
 * @returns {*} Object which can either be an error or updated record
 */
async function getSILCGroupMember(req, res, next){
	console.log('req.params: '+ req.params);
	//console.log('req.params: '+ req.query.toString());
	try {
		let silcGroupMember = await SILCGroupMember.findById(req.params.id);
		if(!silcGroupMember){
			res.status(422);
			return next({message: 'Member not found: '+req.params.id});
		};
		res.status(200).send(silcGroupMember);
		return;
	} catch (error) {
		console.log(err);
		return next(err);
	};	
};
/**
 * GET All SILCGroup Members
 * 
 * Main outer API for getting all SILCGroup Member records.It can also
 * be used to filter out the fields that get returned if passed filter parameters
 * URL Parameters can also be passed to restrict the result set
 * @public
 * @example
 * GET api/silc_group_members
 * OR
 * GET api/silc_group_members/?fields=[first_name,last_name]&active=true
 * }
 * @function
 * @param {*} req incoming http request
 * @param {*} res http server response
 * @param {*} next next middleware in the pipeline
 * @returns {*} Object which represents a collection of members
 */
async function getAllSILCGroupMembers(req, res, next){
	let query = req.query;
	console.log('req.query '+ req.query);
	// Extract query params and url parts, field projection
	try {
		const silcGroupMembers = await SILCGroupMember.find(query);
		res.status(200).send(silcGroupMembers);
		return;
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

module.exports = {
	createSILCGroupMember,
	partialUpdateSILCGroupMember,
	getSILCGroupMember,
	getAllSILCGroupMembers
};