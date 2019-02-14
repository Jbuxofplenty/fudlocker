var AWS = require('aws-sdk');
var ses = new AWS.SES();

var RECEIVER = 'fudlkrinc@gmail.com';
var SENDER = 'fudlkrinc@gmail.com';

var response = {
 "isBase64Encoded": false,
 "headers": { 'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Credentials': true},
 "statusCode": 200,
 "body": "{\"result\": \"Success.\"}"
 };

exports.handler = function (event, context, callback) {
    console.log('Received event:', event);
    sendEmail(event, function (err, data) {
        context.done(err, null);
    });
    callback(null, response);
};

function sendEmail (event, done) {
    var params = {
        Destination: {
            ToAddresses: [
                RECEIVER
            ]
        },
        Message: {
            Body: {
                Text: {
                    Data: 'firstName: ' + event.firstName + '\nlastName: ' + event.lastName + '\nemail: ' + event.email + '\nphone: ' + event.tel + '\naddress: ' + event.address + '\naddress2: ' + event.address2 + '\ncountry: ' + event.country + '\nstate: ' + event.state + '\nzip: ' + event.zip + '\nconsumer: ' + event.consumer + '\nrestaurant: ' + event.restaurant,
                }
            },
            Subject: {
                Data: 'Website Referral Form: ' + event.firstName + ' ' + event.lastName,
            }
        },
        Source: SENDER
    };
        console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(params, function(err, data){
        if(err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log(data);


            console.log("EMAIL CODE END");
            console.log('EMAIL: ', email);

        }
    });


}
