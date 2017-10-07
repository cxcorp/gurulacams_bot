const cacheBuster = require('./cache-buster')
const { allowedToSendToChatAlready } = require('./flood-control')
const Jimp = require("jimp")
const IMAGE_URLS = ['http://haba.tko-aly.fi/kuvat/webcam1.jpg', 'http://haba.tko-aly.fi/kuvat/webcam2.jpg']

function createCamsCommand(tgClient) {
    return msg => {
        if (!allowedToSendToChatAlready(msg.chat.id)) return
        convertAndSend(tgClient, msg)
    }
}

function convertAndSend(tgClient, msg){
    var canvas =  new Jimp(1920, 2160);
    var above_pic = Jimp.read(IMAGE_URLS[0]);
    var below_pic = Jimp.read(IMAGE_URLS[1]);
    
    Promise.all([canvas, above_pic, below_pic]).then(images => {
        images[0].composite(images[1], 0, 0)
                 .composite(images[2], 0, 1080)
                 .resize(960, 1080)
                 .quality(60)
                 .getBuffer(Jimp.MIME_PNG, (error, result) => tgClient.sendPhoto(msg.chat.id, result));
    })
}

function attachCommands(tgClient) {
    tgClient.onText(/^\/cams\b/, createCamsCommand(tgClient))
}

module.exports = { attachCommands }
