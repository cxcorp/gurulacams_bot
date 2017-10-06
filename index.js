'use strict'
const TgClient = require('node-telegram-bot-api')
const fs = require('fs')
const fetch = require('node-fetch')
const Promise = require('bluebird')
require('dotenv').config()

const TG_API_TOKEN = process.env.TG_API_TOKEN
const IMAGE_URLS = ['http://haba.tko-aly.fi/kuvat/webcam1.jpg', 'http://haba.tko-aly.fi/kuvat/webcam2.jpg']
const WEBHOOK_PORT = parseInt(process.env.PORT || '1234', 10)

const client = createClient()
client.onText(/\/cams/, camsCommand)


function createClient() {
    console.log(`HEROKU_APP_NAME: ${process.env.HEROKU_APP_NAME}, WEBHOOK_PORT: ${process.env.WEBHOOK_PORT}`)
    if (process.env.HEROKU_APP_NAME) {
        const client = new TgClient(TG_API_TOKEN, {
            webHook: {
                port: WEBHOOK_PORT
            }
        })
        client.setWebHook(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com/bot${TG_API_TOKEN}`)
        return client
    } else {
        return new TgClient(TG_API_TOKEN, {
            polling: true
        })
    }
}

function camsCommand(msg) {
    client.sendPhoto(msg.chat.id, `${IMAGE_URLS[0]}?nocacheplz=${new Date().getTime()}`)
    client.sendPhoto(msg.chat.id, `${IMAGE_URLS[1]}?nocacheplz=${new Date().getTime()}`)
}
