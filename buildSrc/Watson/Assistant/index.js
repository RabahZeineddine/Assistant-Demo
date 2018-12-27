var AssistantV2 = require('watson-developer-cloud/assistant/v2');

var SESSION_ID
var VALID_SESSION = false

var assistant = new AssistantV2({
    version: process.env.ASSISTANT_VERSION,
    iam_apikey: process.env.API_KEY,
    url: process.env.ASSISTANT_URL
});




const checkAndCreateSession = () => {
    return new Promise((resolve, reject) => {
        if (SESSION_ID && VALID_SESSION) {
            resolve()
        } else {
            assistant.createSession({
                assistant_id: process.env.ASSISTANT_ID
            }, (err, response) => {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    SESSION_ID = response.session_id
                    VALID_SESSION = true
                    resolve()
                }
            })
        }
    })
}

checkAndCreateSession()

const sendMessage = (params) => {
    return new Promise((resolve, reject) => {
        checkAndCreateSession().then(() => {
            var assistantData = new AssistantObject(params)
            assistant.message(assistantData
                , (err, response) => {
                    if (err) {
                        console.log('error: ', err)
                        if (err.error && err.error.code === 404) {
                            // create new session id
                            SESSION_ID = null
                            VALID_SESSION = false
                            checkAndCreateSession()
                                .then(() => sendMessage(params))
                        } else
                            reject(err)
                    } else {
                        resolve(response)
                    }
                })
        })
    })
}

function AssistantObject(params) {
    return {
        assistant_id: process.env.ASSISTANT_ID,
        session_id: SESSION_ID,
        input: {
            'message_type': 'text',
            'text': params.input.text || ' ',
            'options': {
                'return_context': true
            }
        },
        context: params.context || {}
    }
}


module.exports = {
    sendMessage
}