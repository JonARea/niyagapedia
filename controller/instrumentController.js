var Instrument = require('../models/instrument');
var Group = require('../models/group');
var Musician = require('../models/musician');
var async = require('async');

// Display list of all Instrument
exports.instrument_list = function(req, res, next) {
    Instrument.find()
    .sort([['name', 'ascending']])
    .exec(function(err, list_instruments){
      if (err) { return next(err) }
      res.render('instrument_list', {title: 'Instrument List', instrument_list: list_instruments})
    });
};

// Display detail page for a specific Instrument
exports.instrument_detail = function(req, res, next) {
  async.parallel({
    musicians: function(callback){
      Musician.find()
      .sort([['name', 'ascending']])
      .populate('instruments')
      .exec(callback)
    },
    instrument: function(callback){
      Instrument.findById(req.params.id)
      .exec(callback)
    },
  },
    function(err, results) {
      res.render('instrument_detail', {title: 'Instrument Detail', instrument: results.instrument, musician_list: results.musicians })

    })

};

// Display Instrument create form on GET
exports.instrument_create_get = function(req, res) {
    res.render('instrument_form', {title: 'Create Instrument'})
};

// Handle Instrument create on POST
exports.instrument_create_post = function(req, res, next) {

    //Check that the name field is not empty
    req.checkBody('name', 'Instrument name required').notEmpty();

    //Trim and escape the name field.
    req.sanitize('name').escape();
    req.sanitize('name').trim();

    //Run the validators
    var errors = req.validationErrors();

    //Create a instrument object with escaped and trimmed data.
    var instrument = new Instrument(
      { name: req.body.name }
    );

    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        res.render('instrument_form', { title: 'Create Instrument', instrument: instrument, errors: errors});
    return;
    }
    else {
        // Data from form is valid.
        //Check if Instrument with same name already exists
        Instrument.findOne({ 'name': req.body.name })
            .exec( function(err, found_instrument) {
                 console.log('found_instrument: ' + found_instrument);
                 if (err) { return next(err); }

                 if (found_instrument) {
                     //Instrument exists, redirect to its detail page
                     res.redirect(found_instrument.url);
                 }
                 else {

                     instrument.save(function (err) {
                       if (err) { return next(err); }
                       //Instrument saved. Redirect to instrument detail page
                       res.redirect(instrument.url);
                     });

                 }

             });
    }

};

// Display Instrument delete form on GET
exports.instrument_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Instrument delete GET');
};

// Handle Instrument delete on POST
exports.instrument_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Instrument delete POST');
};

// Display Instrument update form on GET
exports.instrument_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Instrument update GET');
};

// Handle Instrument update on POST
exports.instrument_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Instrument update POST');
};
