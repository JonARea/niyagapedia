exports.test = function () {
  var AWS = require('aws-sdk')

  var bucket = 'niyagapedia'

  var s3 = new AWS.S3({
    params: {Bucket: bucket}
  })

  var callback = function(err, data) {
   if (err) {
     console.log(err, err.stack);
   } else {
     console.log(data)
   }
  }
  s3.listObjects({}, callback)
}



exports.upload = function(objBuffer, key, caption) {
  var AWS = require('aws-sdk')

  var bucket = 'niyagapedia'

  var s3 = new AWS.S3({
    params: {Bucket: bucket}
  })
  var params = {
  Body: objBuffer,
  Bucket: "niyagapedia",
  Key: key,
  Tagging: caption
 };
 s3.putObject(params, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);
 })
}
