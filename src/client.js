const TgClient = require('node-telegram-bot-api')

const createWebhookClient = (apiToken, webhook) => {
    console.log('Creating webhook client')

    const { url, port } = webhook
    console.log(`Webhook port: ${port}`)

    const client = new TgClient(apiToken, {
        webHook: { port }
    })
    client.setWebHook(url)
    return client
}

const createPollingClient = apiToken => {
    console.log('Creating polling client')
    return new TgClient(apiToken, {
        polling: true
    })
}

function createClient(opts) {
    const { webhook, apiToken } = opts
    return webhook
        ? createWebhookClient(apiToken, webhook)
        : createPollingClient(apiToken)
}

module.exports = { createClient }
