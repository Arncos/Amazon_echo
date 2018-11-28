'use strict';
// --------------- Helpers that build all of the responses -----------------------
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {type: 'PlainText', text: output, },
        card: {type: 'Simple', title: `SessionSpeechlet - ${title}`, content: `SessionSpeechlet - ${output}`, },
        reprompt: {outputSpeech: {type: 'PlainText', text: repromptText, },
        },
        shouldEndSession,
    };
}
function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}
 
// --------------- Functions that control the skill's behavior -----------------------
function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome TO YOUR APPLICATION ' + 'YOU CAN ADD SOME SCRIPT HERE';
    // If the user either does not reply to the welcome message or says something that is not understood, they will be prompted again with this text.
    const repromptText = '';
    const shouldEndSession = false;
    callback(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
 
function set_INTENT_1_Session(intent, session, callback) {
    let repromptText = 'REPROMT INTENT 1';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = `YOU ARE IN YOUR FIRST INTENT`;
    // Setting repromptText to null signifies that we do not want to reprompt the user. If the user does not respond or says something that is not understood, the session will end.
    callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}
function set_INTENT_2_Session(intent, session, callback) {
    let repromptText = `REPROMPT INTENT 2`;
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = `YOU ARE IN YOUR SECOND INTENT`;
    // Setting repromptText to null signifies that we do not want to reprompt the user. If the user does not respond or says something that is not understood, the session will end.
    callback(sessionAttributes, buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}
 
 
// --------------- Events -----------------------
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}
 
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback);
}
 
function onIntent(intentRequest, session, callback) {
    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;
 
    if (intentName === 'YOUR_INTENT_1') {
        set_INTENT_1_Session(intent, session, callback);
    } else if (intentName === 'YOUR_INTENT_2') {
        set_INTENT_2_Session(intent, session, callback);
    } else {
        throw new Error('Invalid intent');
    }
}
 
function onSessionEnded(sessionEndedRequest, session) { }
 
exports.handler = (event, context, callback) => {
    try {
        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }
         
        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request, event.session, (sessionAttributes, speechletResponse) => { callback(null, buildResponse(sessionAttributes, speechletResponse));  });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request, event.session, (sessionAttributes, speechletResponse) => { callback(null, buildResponse(sessionAttributes, speechletResponse));  });
        } else if (event.request.type === 'SessionEndedRequest') { 
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};