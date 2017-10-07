'use strict'
const fs = require('fs')
const fetch = require('node-fetch')
const Promise = require('bluebird')
const { createClient } = require('./client')
const { attachCommands } = require('./commands')
require('dotenv').config()

const TG_API_TOKEN = process.env.TG_API_TOKEN
const WEBHOOK_PORT = parseInt(process.env.PORT || '1234', 10)

console.log(`Starting bot`)
console.log(`Webhook port: ${WEBHOOK_PORT}`)

const opts = { apiToken: TG_API_TOKEN }
if (process.env.HEROKU_APP_NAME) {
    opts.webhook = {
        url: `https://${process.env.HEROKU_APP_NAME}.herokuapp.com/bot${TG_API_TOKEN}`,
        port: WEBHOOK_PORT
    }
}

const client = createClient(opts)
attachCommands(client)
