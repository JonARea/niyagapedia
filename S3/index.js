var AWS = require('aws-sdk')
var bucket = 'niyagapedia'
var s3 = new AWS.S3({
  params: {Bucket: bucket}
})

exports.upload = function(file, requestBody, callback) {

    var params = {
      Body: file.buffer,
      Bucket: bucket,
      Key: file.originalname,
      ContentType: file.mimetype,

    }
    s3.putObject(params, function(err, data) {
      if (err) console.log(err, err.stack)

      else  callback()
    })
}

exports.getImage = function (key, callback) {
  var params = {
    Bucket: bucket,
    Key: key
  }
  s3.getObject(params, function(err, data) {
    if (err) console.log(err, err.stack)
    else {
      var photoUrl = 'https://s3.amazonaws.com/niyagapedia/' + encodeURIComponent(key)
      callback(photoUrl)
    }
  })
}
