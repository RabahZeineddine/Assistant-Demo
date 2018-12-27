var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var app = express()

require('dotenv').load()


var Assistant = require('./buildSrc/Watson/Assistant')


app.set('PORT', process.env.PORT || 3000)


app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index.html')
})

app.post('/watson/assistant/v1/message', (req, res) => {
    var params = req.body

    Assistant.sendMessage(params)
        .then((response) => {
            res.status(200).json(response)
        })
        .catch((err) => {
            res.status(500).json(err)
        })

})







app.listen(app.get('PORT'), function (err) {
    console.log('App is listening on port: ' + app.get('PORT'))
})