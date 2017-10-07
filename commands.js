const IMAGE_URLS = ['http://haba.tko-aly.fi/kuvat/webcam1.jpg', 'http://haba.tko-aly.fi/kuvat/webcam2.jpg']
const EIGHT_S_TO_MS = 8 * 1000

const getTimestamp = () => new Date().getTime()
const chatIdToPreviousSentTimestamp = {}

const allowedToSendToChatAlready = id => {
    if (process.env.NODE_ENV === 'debug') return true

    const prevTimestamp = chatIdToPreviousSentTimestamp[id]
    chatIdToPreviousSentTimestamp[id] = getTimestamp()

    if (!prevTimestamp) {
        return true
    }

    const now = new Date()
    return (now - prevTimestamp) >= EIGHT_S_TO_MS
}

const createSendPhoto = tgClient => (chatId, imageUrl) => tgClient.sendPhoto(chatId, imageUrl)
const concatCacheBuster = url => `${url}?telegram_plz_no_cache=${new Date().getTime()}`
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
