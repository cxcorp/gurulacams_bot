module.exports = allowedCacheTimeMs => {
    // e.g. allowedCacheTimeMs = 8000
    //      first timestamp is 1507374552000 for 8s, next one is 1507374560000 for 8s, etc.
    const getSteppedTimestamp = () => {
        const now = new Date().getTime()
        return now - (now % allowedCacheTimeMs)
    }

    return function concatCacheBuster(url) {
        // If we always send the same URL, telegram will always use the cached photo.
        // Concatenate a meaningless parameter to bust the cache. However,
        // we allow a cache lifetime of `allowedCacheTimeMs` by keeping the URL
        // the same for that duration.
        return `${url}?plz_telegram_no_cache=${getSteppedTimestamp()}`
    }
}