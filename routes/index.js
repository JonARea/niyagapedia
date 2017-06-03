var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var fs = require('fs');

//handle photo upload
var multer = require('multer');
var upload = multer({ dest: '../public/images' });
var Image = require('../models/image');
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'niyagaphoto',
  api_key: '183951452293572',
  api_secret: 'GEfZkrV-M4ofsWYNF9-Fsu-_Vro'
});

var musician_controller = require('../controller/musicianController');
var Musician = require('../models/musician');

/* GET home page. */

router.get('/', function (req, res, next) {
    res.render('index');
  });


router.get('/register', function(req, res) {
    res.render('register', { });
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

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/catalog');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
//Handle photo uploads
router.get('/upload', function(req, res, next) {
  Musician.find()
  .sort([['name', 'ascending']])
  .exec(function(err, list_musicians){
    if (err) {return next(err) }
    res.render('upload', {musicians: list_musicians})
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


router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});


module.exports = router;
