var express = require('express');
var router = express.Router();

//controllers modules
var musician_controller = require('../controllers/musicianController');
var group_controller = require('../controllers/groupController');

var instrument_controller = require('../controllers/instrumentController');

router.get('/', group_controller.index);
router.get('/group/create', group_controller.group_create_get);
router.post('/group/create', group_controller.group_create_post);
/* GET request to delete Group. */
router.get('/group/:id/delete', group_controller.group_delete_get);

// POST request to delete Group
router.post('/group/:id/delete', group_controller.group_delete_post);

/* GET request to update Group. */
router.get('/group/:id/update', group_controller.group_update_get);
// POST request to update Group
router.post('/group/:id/update', group_controller.group_update_post);

/* GET request for one Group. */
router.get('/group/:id', group_controller.group_detail);

/* GET request for list of all Group items. */
router.get('/groups', group_controller.group_list);
/// AUTHOR ROUTES ///

/* GET request for creating Musician. NOTE This must come before route for id (i.e. display musician) */
router.get('/musician/create', musician_controller.musician_create_get);

/* POST request for creating Musician. */
router.post('/musician/create', musician_controller.musician_create_post);

/* GET request to delete Musician. */
router.get('/musician/:id/delete', musician_controller.musician_delete_get);

// POST request to delete Musician
router.post('/musician/:id/delete', musician_controller.musician_delete_post);

/* GET request to update Musician. */
router.get('/musician/:id/update', musician_controller.musician_update_get);

// POST request to update Musician
router.post('/musician/:id/update', musician_controller.musician_update_post);

/* GET request for one Musician. */
router.get('/musician/:id', musician_controller.musician_detail);

/* GET request for list of all Musicians. */
router.get('/musicians', musician_controller.musician_list);

/// GENRE ROUTES ///

/* GET request for creating a Instrument. NOTE This must come before route that displays Instrument (uses id) */
router.get('/instrument/create', instrument_controller.instrument_create_get);

/* POST request for creating Instrument. */
router.post('/instrument/create', instrument_controller.instrument_create_post);

/* GET request to delete Instrument. */
router.get('/instrument/:id/delete', instrument_controller.instrument_delete_get);

// POST request to delete Instrument
router.post('/instrument/:id/delete', instrument_controller.instrument_delete_post);

/* GET request to update Instrument. */
router.get('/instrument/:id/update', instrument_controller.instrument_update_get);

// POST request to update Instrument
router.post('/instrument/:id/update', instrument_controller.instrument_update_post);

/* GET request for one Instrument. */
router.get('/instrument/:id', instrument_controller.instrument_detail);

/* GET request for list of all Instrument. */
router.get('/instruments', instrument_controller.instrument_list);



module.exports = router;
