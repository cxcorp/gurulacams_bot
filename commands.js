const cacheBuster = require('./cache-buster')
const { allowedToSendToChatAlready } = require('./flood-control')

const IMAGE_URLS = ['http://haba.tko-aly.fi/kuvat/webcam1.jpg', 'http://haba.tko-aly.fi/kuvat/webcam2.jpg']
const EIGHT_S_TO_MS = 8 * 1000

const createSendPhoto = tgClient => (chatId, imageUrl) => tgClient.sendPhoto(chatId, imageUrl)
const concatCacheBuster = cacheBuster(EIGHT_S_TO_MS)
const getImageUrls = () => IMAGE_URLS.map(concatCacheBuster)

function createCamsCommand(tgClient) {
    const sendPhoto = createSendPhoto(tgClient)

    return msg => {
        if (!allowedToSendToChatAlready(msg.chat.id)) return
        getImageUrls().forEach(url => {
            sendPhoto(msg.chat.id, url)
        })
    }
}

function attachCommands(tgClient) {
    tgClient.onText(/^\/cams\b/, createCamsCommand(tgClient))
}

module.exports = { attachCommands }
