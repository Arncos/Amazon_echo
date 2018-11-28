const config = {};
config.IOT_BROKER_ENDPOINT ="YOUR_ENDPOINT.iot.YOUR_REGION.amazonaws.com";
config.IOT_BROKER_REGION = "YOUR_REGION"; 
config.IOT_THING_NAME = "YOUR_THING_NAME";
var AWS = require('aws-sdk');
AWS.config.region = config.IOT_BROKER_REGION;
var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});
 
{... Some code ...}
function setUpShadow(intent, session, callback){
    let speechOutput = 'OK I'll do that ';
    let newState = {'command': "YOUR_SHADOW_COMMAND"};
    updateShadow(newState,callback, speechOutput,session,intent);
}
 
{... Some code ...}
 
function updateShadow(desiredState,callback,speechOutput,session ,intent) {
    let repromptText = ``;
    let sessionAttributes = {};
    const shouldEndSession = true;
    // Prepare the parameters of the update call
    var paramsUpdate = {
        "thingName" : config.IOT_THING_NAME,
        "payload" : JSON.stringify(
            { "state":
                { "desired": desiredState
                }
            }
        )
    };
    iotData.updateThingShadow(paramsUpdate, function(err, data)  {
        if (err){
            console.log("Shadow iotData error: " + err);
             callback(sessionAttributes,
                buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        }
        else {
             console.log("updated thing shadow " + config.IOT_THING_NAME + ' to state ' + paramsUpdate.payload);
             callback(sessionAttributes,
                buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
        }
    });
}