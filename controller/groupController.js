var Group = require('../models/group');

var Musician = require('../models/musician');
var Instrument = require('../models/instrument');


var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        group_count: function(callback) {
            Group.count(callback);
        },
        musician_count: function(callback) {
            Musician.count(callback);
        },
        instrument_count: function(callback) {
            Instrument.count(callback);
        },
    }, function(err, results) {
        res.render('catalog', { title: 'Nyogopedia Home', error: err, data: results });
    });
};

// Display list of all groups
exports.group_list = function(req, res, next) {

  Group.find()
    .exec(function (err, list_groups) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('group_list', { title: 'Group List', group_list: list_groups });
    });
};

// Display detail page for a specific group
exports.group_detail = function(req, res, next) {
  async.parallel({
    group: function(callback) {
      Group.findById(req.params.id)
        .populate('musicians')

        .exec(callback);
    },
  }, function(err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('group_detail', { title: results.group.name, group: results.group, });
  });

    //Successful, so render


};

// Display group create form on GET
exports.group_create_get = function(req, res, next) {


        res.render('group_form', { title: 'Create Group' });


};

// Handle group create on POST
exports.group_create_post = function(req, res, next) {

    req.checkBody('name', 'Name must not be empty.').notEmpty();
    req.checkBody('summary', 'Summary must not be empty').notEmpty();

    req.sanitize('name').escape();

    req.sanitize('summary').escape();

    req.sanitize('name').trim();

    req.sanitize('summary').trim();


    var group = new Group({
        name: req.body.name,

        summary: req.body.summary,


    });

    console.log('GROUP: ' + group);

    var errors = req.validationErrors();
    if (errors) {
        // Some problems so we need to re-render our group
      res.render('group_form', { title: 'Create Group', group: group, errors: errors });


    }
    else {
    // Data from form is valid.
    // We could check if group exists already, but lets just save.

        group.save(function (err) {
            if (err) { return next(err); }
            //successful - redirect to new group record.
            res.redirect(group.url);
        });
    }

};

// Display Musician delete form on GET
exports.group_delete_get = function(req, res, next) {

    async.parallel({
        group: function(callback) {
            Group.findById(req.params.id)
              .populate('name')
              .populate('musician')
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('group_delete', { title: 'Delete Group', group: results.group } );
    });

};

// Handle Musician delete on POST
exports.group_delete_post = function(req, res, next) {

    req.checkBody('groupid', 'Group id must exist').notEmpty();

    async.parallel({
      group: function(callback) {
          Group.findById(req.params.id).exec(callback);
      },
      // musicians: function(callback) {
      //   Musician.find({}, )
      // }

    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.group_instances>0) {
            //Group has instances. Render in same way as for GET route.
            res.render('group_delete', { title: 'Delete Group', group: results.group, group_instances: results.group_instances } );
            return;
        }
        else {
            //Group has no instances. Delete object and redirect to the list of groups.
            Group.findByIdAndRemove(req.body.groupid, function deleteGroup(err) {
                if (err) { return next(err); }
                //Success - got to musician list
                res.redirect('/catalog/groups');
            });

        }
    });

};

// Display group update form on GET
exports.group_update_get = function(req, res, next) {

    req.sanitize('id').escape();
    req.sanitize('id').trim();

    //Get group, musicians and instruments for form
    async.parallel({
      group: function(callback){
        Group.findById(req.params.id)
        .populate('musicians')
        .exec(callback)
      },
      musicians: function(callback){
        Musician.find()
        .sort([['name', 'ascending']])
        .exec(callback)
      },
    }, function (err, results) {
      if (err) {
        return next(err)
      }

      res.render('group_form', { title: 'Update Group', group: results.group, musicians: results.musicians });

    });
};

// Handle group update on POST
exports.group_update_post = function(req, res, next) {

    //Sanitize id passed in.
    req.sanitize('id').escape();
    req.sanitize('id').trim();

    //Check other data
    req.checkBody('name', 'Name must not be empty.').notEmpty();
    req.checkBody('summary', 'Summary must not be empty.').notEmpty();

    req.sanitize('name').escape();
    req.sanitize('musicians').escape();
    req.sanitize('summary').escape();

    req.sanitize('name').trim();
    req.sanitize('musicians').trim();
    req.sanitize('summary').trim();

    var group = new Group(
      { name: req.body.name,
        summary: req.body.summary,
        musicians: req.body.musician,
        _id:req.params.id //This is required, or a new ID will be assigned!
       });

    var errors = req.validationErrors();
    if (errors) {

      res.render('group_form', { title: 'Update Group', group: group, errors: errors });
    }

    else {
        // Data from form is valid. Update the record.
        Group.findByIdAndUpdate(req.params.id, group, {}, function (err,thegroup) {
            if (err) { return next(err); }
            //successful - redirect to group detail page.
            res.redirect(thegroup.url);
        });
    }
};
