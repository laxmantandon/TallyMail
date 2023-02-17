const http = require('http')
const axios = require('axios')
const express = require('express')
const app = express()
const server = http.createServer(app)
const path = require('path')
const fs = require('fs')
const morgan = require('morgan')
const nodemailer = require('nodemailer')
const { basename } = require('path')

const host = "0.0.0.0"
const port = "35040"

app.set('Host', host)
app.set('Port', port)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

app.get('/', (req, res) => res.send('TallyMail Service is Running !!'))

app.post('/TallyMail', (req, res) => {

    payload = req.body
    file_path = payload["attachment"] //"C:\\Users\\laxman\\OneDrive\\Desktop\\etpl\\Express Tradecom ERP Next - Asian Agencies, Raipur.pdf"

    var transport = nodemailer.createTransport({
        service: payload["service"],
        auth: {
            user: payload["from_email"],
            pass: payload["password"]
        }
    });

    const mailOptions = {
        from: payload["from_email"], // sender address
        to: payload["to_email"], // list of receivers
        subject: payload["subject"], // Subject line
        html: payload["body"],// plain text body,
        attachments: [
            {
                filename: path.parse(file_path).base,
                path: file_path
            }
        ]
        
    };

    transport.sendMail(mailOptions, function (err, info) {
        if (err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ "message" : err});
            return   
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send({ "message" : 'Email Sent'});
            return
        }
    })

    
})



module.exports = {
    app, server
}
