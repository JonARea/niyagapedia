var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var fs = require('fs');

//handle photo upload
var testS3 = require('../controller/testupload')
var multer = require('multer');
var upload = multer({ dest: '../test' });
var Image = require('../models/image');
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

var musician_controller = require('../controller/musicianController');
var Musician = require('../models/musician');

/* GET home page. */

router.get('/', function (req, res, next) {
    res.redirect('/catalog');
  });


router.get('/register', function(req, res) {
    res.render('register', {user: req.user });
});

router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});


router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
//Handle photo uploads
router.get('/upload/test', function(req,res,next) {
  testS3()
})
router.get('/upload', function(req, res, next) {
  Musician.find()
  .sort([['name', 'ascending']])
  .exec(function(err, list_musicians){
    if (err) {return next(err) }
    res.render('upload', {musicians: list_musicians, user: req.user })
  });
});
router.post('/upload', upload.single('photoToUpload'), function (req, res, next) {
  cloudinary.uploader.upload(req.file.path, function(result){
    var image = new Image ({
      musician: req.body.musician,
      caption: req.body.caption,
      url: result.url
    });
    image.save(function(err){
      if (err) {return err }
      res.redirect('/catalog/musician/' + req.body.musician);
    });
  });


  // pic.save(function(err){
  //   if (err) { return next(err) }
  //   res.redirect('/')
  // });
});


router.get('/accordion', function(req, res){
    res.render('accordion');
});


module.exports = router;
