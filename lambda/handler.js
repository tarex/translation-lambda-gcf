'use strict';
var AWS = require('aws-sdk');

function getPresignedURL(outputText) {
  var presigner = new AWS.Polly.Presigner();
  var url = presigner.getSynthesizeSpeechUrl({
    TextType: 'text',
    OutputFormat: 'mp3',
    VoiceId: 'Emma',
    Text: outputText,
  });
  return url;
}

module.exports.hello = (event, context, callback) => {
  const { text } = JSON.parse(event.body);
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ presignedUrl: getPresignedURL(text) }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
