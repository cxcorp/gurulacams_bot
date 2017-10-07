const getTimestamp = () => new Date().getTime()
const chatIdToPreviousSentTimestamp = {}

function allowedToSendToChatAlready(id) {
    if (process.env.NODE_ENV === 'debug') return true

    const prevTimestamp = chatIdToPreviousSentTimestamp[id]
    chatIdToPreviousSentTimestamp[id] = getTimestamp()

    if (!prevTimestamp) {
        return true
    }

    const now = new Date()
    return (now - prevTimestamp) >= EIGHT_S_TO_MS
}

module.exports = { allowedToSendToChatAlready }
