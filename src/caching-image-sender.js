const { maxByProp, timestamp } = require('./util')

// type FileId = string
// type Photo = string | Buffer | Stream
// type Payload = Photo | FileId
class CachingImageSender {
    constructor(
        tgClient, // TelegramClient
        fetchPhoto, // () => Photo
        cacheLifetimeMs // number
    ) {
        this.tgClient = tgClient
        this.fetchPhoto = fetchPhoto
        this.cacheLifetime = cacheLifetimeMs

        this.lastUpdated = new Date(0).getTime() // number
        this.payload = null // Payload

        this.send = this.send.bind(this)
    }

    /** @returns {boolean} */
    cacheIsValid() {
        const now = timestamp()
        const age = now - this.lastUpdated
        return age < this.cacheLifetime
    }

    /** @returns {Promise<Photo>} */
    async updateCache() {
        const photo = await this.fetchPhoto()
        this.lastUpdated = timestamp()
        this.payload = photo
        return photo
    }

    /** @returns {Promise<void>} */
    async send(chatId) {
        const payload = this.cacheIsValid() ? payload : await this.updateCache()
        const tgResponse = await this.tgClient.sendPhoto(chatId, payload)

        // TG has all kinds of thumbnails in the photo array, find the
        // biggest one. We can just compare heights since they all have the same
        // aspect ratio.
        const biggestPhoto = maxByProp(tgResponse.photo, photo => photo.height)
        // cache file ID so we can send that instead of uploading the buffer
        // again if the cache is valid
        this.payload = biggestPhoto.file_id
    }
}

module.exports = { CachingImageSender }
