var Musician = require('../models/musician')
var Group = require('../models/group')
var Instrument = require('../models/instrument')
var Image = require('../models/image')
var s3 = require('../controllers/testupload')
var async = require('async')

exports.musician_list = function(req, res, next) {
  Musician.find()
  .sort([['name', 'ascending']])
  .exec(function(err, list_musicians){
    if (err) { return next(err) }
    res.render('musician_list', {title: 'Musician List', musician_list: list_musicians, user: req.user })
  })
}

// Display detail page for a specific Musician
exports.musician_detail = function(req, res, next) {

  async.parallel({
    musician: function(callback) {
      Musician.findById(req.params.id)
        .populate('groups')
        .populate('instruments')
        .exec(callback)
    },
    photoSchema: function(callback) {
      Image.findOne({musician: req.params.id })
      .exec(callback)
    },
  }, function(err, results) {
    if (err) { return next(err)  }
    //Successful, so render
    if (results.photoSchema && results.photoSchema.key) {
      s3.getImage(results.photoSchema.key, function(photoUrl) {
        res.render('musician_detail', { title: 'Musician Detail', musician: results.musician, musician_groups: results.musician.groups, musician_instruments: results.musician.instruments, photo: photoUrl, user: req.user })
      })
      } else {
      //no photo was found
      Image.findOne({caption: 'gong'})
      .exec(function(err, gongPic) {
        res.render('musician_detail', { title: 'Musician Detail', musician: results.musician, musician_groups: results.musician.groups, musician_instruments: results.musician.instruments, photo: gongPic.url, user: req.user })
      })

    }

  })

}

// Display Musician create form on GET
exports.musician_create_get = function(req, res) {
  async.parallel({
    list_instruments: function(callback){
      Instrument.find()
      .sort([['name', 'ascending']])
      .exec(callback)
    },
    list_groups: function(callback){
      Group.find()
      .sort([['name', 'ascending']])
      .exec(callback)
    },
  },
  function(err, results){
    if (err) { return next(err) }
    //handle 'goback button'
    var musician = {url: '/'}
    res.render('musician_form', {title: 'New Musician', instrument_list: results.list_instruments, group_list: results.list_groups, musician: musician, user: req.user })
  })

}

// Handle Musician create on POST
exports.musician_create_post = function(req, res, next) {

    req.checkBody('name', 'Name must be specified.').notEmpty()  //We won't force Alphanumeric, because people might have spaces.


    req.sanitize('name').escape()
    req.sanitize('other_names').escape()
    req.sanitize('biography').escape()
    req.sanitize('anecdotes').escape()
    req.sanitize('name').trim()
    req.sanitize('other_names').trim()
    req.sanitize('anecdotes').trim()
    req.sanitize('biography').trim()
    req.sanitize('date_of_birth').escape()
    req.sanitize('date_of_birth').trim()
    req.sanitize('date_of_death').escape()
    req.sanitize('date_of_death').trim()

    var errors = req.validationErrors()
    var musician = new Musician(
      { name: req.body.name,
        other_names: req.body.other_names,
        biography: req.body.biography,
        anecdotes: req.body.anecdotes,
        groups: (req.body.groups===undefined) ? [] : req.body.groups,
        instruments: (req.body.instruments===undefined) ? [] : req.body.instruments,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
       })

    if (errors) {
        res.render('musician_form', { title: 'New Musician', musician: musician, errors: errors, user: req.user })
    return
    }
    else {
    // Data from form is valid, add musician to selected groups and instruments lists


        musician.save(function (err) {
            if (err) { return next(err)  }
            if (req.body.groups!==undefined && Array.isArray(req.body.groups)) {
              req.body.groups.forEach(function(group){
                Group.findById(group).exec(function(err, g){
                  if (err) {return err}
                  g.musicians.push(musician._id)
                  g.save()
                })
                })

              } else if (req.body.groups!==undefined){
                Group.findById(req.body.groups).exec(function(err, g){
                  if (err) {return err}
                  g.musicians.push(musician._id)
                  g.save()
                })
              }
               //successful - redirect to new musician record.
               res.redirect(musician.url)
            })
    }

}

// Display Musician delete form on GET
exports.musician_delete_get = function(req, res, next) {

    async.parallel({
        musician: function(callback) {
            Musician.findById(req.params.id).exec(callback)
        },
        musicians_groups: function(callback) {
          Group.find({ 'musician': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err)  }
        //Successful, so render
        res.render('musician_delete', { title: 'Delete Musician', musician: results.musician, musician_groups: results.musicians_groups, user: req.user } )
    })

}

// Handle Musician delete on POST
exports.musician_delete_post = function(req, res, next) {

    req.checkBody('musicianid', 'Musician id must exist').notEmpty()

    async.parallel({
        musician: function(callback) {
            Musician.findById(req.body.musicianid).exec(callback)
        },
        musicians_groups: function(callback) {
          Group.find({ 'musician': req.body.musicianid },'title summary').exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err)  }
        //Success
        if (results.musicians_groups>0) {
            //Musician has groups. Render in same way as for GET route.
            res.render('musician_delete', { title: 'Delete Musician', musician: results.musician, musician_groups: results.musicians_groups, user: req.user } )
            return
        }
        else {
            //Musician has no groups. Delete object and redirect to the list of musicians.
            Musician.findByIdAndRemove(req.body.musicianid, function deleteMusician(err) {
                if (err) { return next(err)  }
                //Success - got to musician list
                res.redirect('/catalog/musicians')
            })

        }
    })

}

// Display group update form on GET
exports.musician_update_get = function(req, res, next) {

    req.sanitize('id').escape()
    req.sanitize('id').trim()

    //Get groups for form
    async.parallel({

        musician: function(callback) {
          Musician.findById(req.params.id)
            .populate('groups')
            .populate('instruments')
            .exec(callback)
        },
        groups: function(callback) {
          Group.find()
          .exec(callback)
        },
        instruments: function(callback) {
          Instrument.find()
          .exec(callback)
        },
      }, function(err, results) {
        if (err) { return next(err)  }
        //Successful, so render
        // Mark our selected instruments as checked
        for (var all_g_iter = 0;  all_g_iter < results.instruments.length;  all_g_iter++) {
            for (var musician_g_iter = 0;  musician_g_iter < results.musician.instruments.length;  musician_g_iter++) {
                if (results.instruments[all_g_iter]._id.toString()==results.musician.instruments[musician_g_iter]._id.toString()) {
                    results.instruments[all_g_iter].checked='true'
                }
            }
        }
        for (var all_g_iter = 0; all_g_iter < results.groups.length;  all_g_iter++) {
            for (var musician_g_iter = 0;  musician_g_iter < results.musician.groups.length;  musician_g_iter++) {
                if (results.groups[all_g_iter]._id.toString()==results.musician.groups[musician_g_iter]._id.toString()) {
                    results.groups[all_g_iter].checked='true'
                }
            }
        }

        res.render('musician_form', { title: 'Update Musician', musician: results.musician, group_list: results.groups, instrument_list:results.instruments, user: req.user })
      })

}


exports.musician_update_post = function(req, res, next) {


    req.sanitize('id').escape()
    req.sanitize('id').trim()


    req.checkBody('biography', 'Biography must not be empty').notEmpty()


    req.sanitize('name').escape()
    req.sanitize('other_names').escape()
    req.sanitize('biography').escape()
    req.sanitize('anecdotes').escape()
    req.sanitize('date_of_birth').escape()
    req.sanitize('date_of_death').escape()
    req.sanitize('instruments').escape()
    req.sanitize('groups').escape()

    req.sanitize('name').trim()
    req.sanitize('other_names').trim()
    req.sanitize('biography').trim()
    req.sanitize('anecdotes').trim()
    req.sanitize('date_of_birth').trim()
    req.sanitize('date_of_death').trim()
    req.sanitize('instruments').trim()
    req.sanitize('groups').trim()

    var musician = new Musician(
      { name: req.body.name,
        other_names: req.body.other_names,
        biography: req.body.biography,
        anecdotes: (typeof req.body.anecdotes==='undefined') ? '' : req.body.anecdotes,
        instruments: (typeof req.body.instruments==='undefined') ? [] : req.body.instruments.split(","),
        groups: (typeof req.body.groups==='undefined') ? [] : req.body.groups.split(","),

        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,

        _id:req.params.id
       })

    var errors = req.validationErrors()
    if (errors) {
        // Re-render musician with error information
        // Get all groups for form
        async.parallel({

            musician: function(callback) {
              Musician.findById(req.params.id)
                .populate('groups')
                .populate('instruments')
                .exec(callback)
            },
            groups: function(callback) {
              Group.find()
              .exec(callback)
            },
            instruments: function(callback) {
              Instrument.find()
              .exec(callback)
            },
          }, function(err, results) {
            if (err) {
              return next(err)
            }
            //Successful, so render

            for (var all_g_iter = 0;  all_g_iter < results.instruments.length;  all_g_iter++) {
                for (var musician_g_iter = 0;  musician_g_iter < results.musician.instruments.length;  musician_g_iter++) {
                    if (results.instruments[all_g_iter]._id.toString()==results.musician.instruments[musician_g_iter]._id.toString()) {
                        results.instruments[all_g_iter].checked='true'
                    }
                }
            }
            for (var all_g_iter = 0;  all_g_iter < results.groups.length;  all_g_iter++) {
                for (var musician_g_iter = 0;  musician_g_iter < results.musician.groups.length;  musician_g_iter++) {
                    if (results.groups[all_g_iter]._id.toString()==results.musician.groups[musician_g_iter]._id.toString()) {
                        results.groups[all_g_iter].checked='true'
                    }
                }
            }

            res.render('musician_form', { errors: errors, title: 'Update Musician', musician: results.musician, group_list: results.groups, instrument_list:results.instruments, user: req.user })
          })
    }
    else {
        // Data from form is valid. Update the record.
        Musician.findByIdAndUpdate(req.params.id, musician, {}, function (err,thegroup) {
            if (err) { return next(err)  }
            //update group
            if (musician.groups!==undefined && Array.isArray(musician.groups)) {
              musician.groups.forEach(function(group){
                Group.findById(group).exec(function(err, g){
                  if (err) {return err}
                  if (g.musicians.indexOf(musician._id)=== -1) {
                  g.musicians.push(musician._id)
                  g.save()
                  }
                })
              })

            } else if (musician.groups!==undefined){
                Group.findById(musician.groups).exec(function(err, g){
                  if (err) {return err}
                  if (g.musicians.indexOf(musician._id)=== -1) {
                  g.musicians.push(musician._id)
                  g.save()
                  }
                })
            }

            //successful - redirect to group detail page.

            res.redirect(musician.url)
        })
    }

}
