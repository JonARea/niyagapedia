exports.testS3 = function () {
  var AWS = require('aws-sdk')


  // Initialize the Amazon Cognito credentials provider
  AWS.config.region = 'us-east-1'; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'us-east-1:3cc7f920-81ce-4a59-8e43-a539004f605e',
  });
  var bucket = 'niyagapedia'


  AWS.s3.listBuckets({}, function (err, data) {
    if (err) {
      console.log(err, err.stack)
    } else {
      console.log(data)
    }
  })
}
