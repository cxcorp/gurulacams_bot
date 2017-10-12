// maxByProp<T>(T[], T => Comparable)
function maxByProp(array, selector) {
    return array.reduce((currGreatest, candidate) => {
        return selector(candidate) > selector(currGreatest) ? candidate : currGreatest
    }, array[0])
}

function timestamp() {
    return new Date().getTime()
}

module.exports = {
    maxByProp,
    timestamp
}