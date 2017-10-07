const getTimestamp = () => new Date().getTime()
const EIGHT_S_TO_MS = 8 * 1000
const chatIdToPreviousSentTimestamp = {}

function allowedToSendToChatAlready(id) {
    if (process.env.NODE_ENV === 'debug') return true
    const now = getTimestamp()

    const prevTimestamp = chatIdToPreviousSentTimestamp[id]
    chatIdToPreviousSentTimestamp[id] = now

    if (!prevTimestamp) return true
    return (now - prevTimestamp) >= EIGHT_S_TO_MS
}

module.exports = { allowedToSendToChatAlready }
