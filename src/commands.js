const util = require('util')
const { allowedToSendToChatAlready } = require('./flood-control')
const { CachingImageSender } = require('./caching-image-sender')
const Jimp = require("jimp")
Jimp.prototype.getBufferAsync = util.promisify(Jimp.prototype.getBuffer)

const IMAGE_URLS = ['http://haba.tko-aly.fi/kuvat/webcam1.jpg', 'http://haba.tko-aly.fi/kuvat/webcam2.jpg']
const EIGHT_S_TO_MS = 8 * 1000

function createCamsCommand(tgClient) {
    const camsSender = new CachingImageSender(tgClient, fetchAndConvertPhoto, EIGHT_S_TO_MS)

    return msg => {
        const chatId = msg.chat.id
        if (!allowedToSendToChatAlready(chatId)) return

        doWithLoadingMessage(tgClient, chatId, () => camsSender.send(chatId))
    }
}

/**
 * Sends a "Loading..." message, then removes it after the action has finished.
 * @param {TelegramClient} tgClient
 * @param {string} chatId
 * @param {() => Promise<void>} action
 * @returns {Promise<void>}
 */
async function doWithLoadingMessage(tgClient, chatId, action) {
    const opts = {
        parse_mode: 'markdown',
        disable_notification: true
    }

    const loadingMessage = await tgClient.sendMessage(chatId, '_Loading..._', opts);
    await action();
    await tgClient.deleteMessage(chatId, loadingMessage.message_id);
}

/** @returns {Promise<Buffer>} */
async function fetchAndConvertPhoto() {
    const [canvas, abovePic, belowPic] = await Promise.all([
        new Jimp(1920, 2160),
        Jimp.read(IMAGE_URLS[0]),
        Jimp.read(IMAGE_URLS[1])
    ])

    return canvas
        .composite(abovePic, 0, 0)
        .composite(belowPic, 0, 1080)
        .resize(960, 1080)
        .quality(60)
        .getBufferAsync(Jimp.MIME_PNG)
}

function attachCommands(tgClient) {
    tgClient.onText(/^\/cams\b/, createCamsCommand(tgClient))
}

module.exports = { attachCommands }
