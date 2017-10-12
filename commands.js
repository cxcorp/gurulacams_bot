const Promise = require('bluebird')
const { allowedToSendToChatAlready } = require('./flood-control')
const { CachingImageSender } = require('./caching-image-sender')
const Jimp = require("jimp")
Jimp.prototype.getBufferAsync = Promise.promisify(Jimp.prototype.getBuffer)

const IMAGE_URLS = ['http://haba.tko-aly.fi/kuvat/webcam1.jpg', 'http://haba.tko-aly.fi/kuvat/webcam2.jpg']
const EIGHT_S_TO_MS = 8 * 1000

function createCamsCommand(tgClient) {
    const sender = new CachingImageSender(tgClient, fetchAndConvertPhoto, EIGHT_S_TO_MS)

    return msg => {
        if (!allowedToSendToChatAlready(msg.chat.id)) return
        sender.send(msg.chat.id)
    }
}

function fetchAndConvertPhoto() { // () => Promise<Buffer>
    var canvas = new Jimp(1920, 2160)
    var above_pic = Jimp.read(IMAGE_URLS[0]);
    var below_pic = Jimp.read(IMAGE_URLS[1]);

    return Promise.all([canvas, above_pic, below_pic])
        .then(images => {
            return images[0]
                .composite(images[1], 0, 0)
                .composite(images[2], 0, 1080)
                .resize(960, 1080)
                .quality(60)
                .getBufferAsync(Jimp.MIME_PNG)
        })
}

function attachCommands(tgClient) {
    tgClient.onText(/^\/cams\b/, createCamsCommand(tgClient))
}

module.exports = { attachCommands }
