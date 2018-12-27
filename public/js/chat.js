/**
 * @author Rabah Zeineddine
 */

var WATSON = 'watson'
var USER = 'user'
var WATSON_API = '/watson/assistant/v1/message'
var context = {}

var openChat = false
function chatToggle() {
    var chatHolder = document.getElementById('chat-holder')
    var toggleClass = openChat ? 'close' : 'open'
    var currentClass = openChat ? 'open' : 'close'
    // for the first toggle
    if (chatHolder.className.indexOf('closed') != - 1) {
        currentClass = 'closed'
        sendToWatson(' ')
    }
    chatHolder.className = chatHolder.className.replace(currentClass, toggleClass)
    openChat = !openChat
}

function handleKeyPress(event) {
    if (event && event.keyCode === 13 && event.key === 'Enter') {
        sendMessage()
    }
}

function sendMessage() {
    var chatInput = document.getElementById('chat-input')
    var userMessage = chatInput.value
    if (userMessage && userMessage.trim() != '') {
        chatInput.value = ''
        displayMessage(userMessage, USER)
        sendToWatson(userMessage)
    }
}

function sendToWatson(message) {
    var params = new CreateWatsonObject(message)
    xhrPost(WATSON_API, params, (watsonData) => {
        showWatsonResponse(watsonData)
    }, (err) => {

    })
}

function showWatsonResponse(watsonData) {
    var action = watsonData.output.action || null
    switch (action) {

        default:
            watsonData.output.text.forEach((text) => displayMessage(text, WATSON))
            break;
    }
}

function displayMessage(message, type) {
    var chatBody = document.getElementById('chat-body')
    var bubble = new Bubble(message, type)
    chatBody.append(bubble)
    chatBody.scrollTop = chatBody.scrollHeight
}

function Bubble(message, type) {
    var div = document.createElement('div')
    div.setAttribute('class', 'bubble ' + type)
    div.innerHTML = message
    return div;
}

function CreateWatsonObject(message) {
    return {
        input: {
            text: message || ' '
        },
        context: context || {}
    }
}