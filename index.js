'use strict'
const TgClient = require('node-telegram-bot-api')
const fs = require('fs')
const fetch = require('node-fetch')
const Promise = require('bluebird')
require('dotenv').config()

const TG_API_TOKEN = process.env.TG_API_TOKEN
const IMAGE_URLS = ['http://haba.tko-aly.fi/kuvat/webcam1.jpg', 'http://haba.tko-aly.fi/kuvat/webcam2.jpg']
const WEBHOOK_PORT = parseInt(process.env.PORT ||  '1234', 10)

console.log(`Starting bot`)
console.log(`Webhook port: ${WEBHOOK_PORT}`)

const client = createClient()
client.onText(/\/cams/, camsCommand)

function createClient() {
    if (process.env.HEROKU_APP_NAME) {
        console.log('Creating webhook client')
        const client = new TgClient(TG_API_TOKEN, {
            webHook: {
                port: WEBHOOK_PORT
            }
        })
        client.setWebHook(`https://${process.env.HEROKU_APP_NAME}.herokuapp.com/bot${TG_API_TOKEN}`)
        return client
    } else {
        console.log('Creating polling client')
        return new TgClient(TG_API_TOKEN, {
            polling: true
        })
    }
}

const EIGHT_S_TO_MS = 8 * 1000
const getTimestamp = () => new Date().getTime()
const chatIdToPreviousSentTimestamp = {}

const allowedToSendToChatAlready = id => {
    const prevTimestamp = chatIdToPreviousSentTimestamp[id]
    chatIdToPreviousSentTimestamp[id] = getTimestamp()

    if (!prevTimestamp) {
        return true
    }

    const now = new Date()
    return (now - prevTimestamp) >= EIGHT_S_TO_MS
}

const createSendPhoto = chatId => imageUrl => client.sendPhoto(chatId, imageUrl)
const concatCacheBuster = url => `${url}?telegram_plz_no_cache=${new Date().getTime()}`
const getImageUrls = () => IMAGE_URLS.map(concatCacheBuster)

function camsCommand(msg) {
    if (!allowedToSendToChatAlready(msg.chat.id)) return

    const sendPhoto = createSendPhoto(msg.chat.id)
    getImageUrls().forEach(sendPhoto)
}
