let router = require('express').Router();
let controller = require('../../controllers/silc/silc_groups.controller');
const { validateParam, schemas } = require('../../../../helpers/http.route.validator');

router.route('/')
    //Get ALL SILC Groups
    .get(controller.getAllSILCGroups)
    //Add New SILC Group
   .post(controller.createSILCGroup)
router.route('/:id')
    //Get a specific Group
    //.get(validateParam(schemas.idSchema, 'id'), controller.getSILCGroup)
    //Update SILC Group Record
    //.put(controller.updateSILCGroup)
    //Delete SILC Group Record
    //.delete(controller.deleteSILCGroup)
module.exports = router;