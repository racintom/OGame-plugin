//@ts-nocheck
export function extractPortionOfText(wholeText: string, fromString: string, toString: string): string {
    const indexFrom = wholeText.indexOf(fromString)
    const indexTo = wholeText.indexOf(toString, indexFrom)

    return wholeText.substring(indexFrom + fromString.length, indexTo)
}

export function removeCommasFromText(text: string): string {
    return text.replace(/,/g, '')
}

export function removeLettersFromNumber(numberWithLetters: string): string {
    return numberWithLetters.replace(/[a-zA-Z]*/g, '').trim()
}

export function formatDate(timeInSeconds: number): string {
    const date = new Date(timeInSeconds * 1000)

    const hours = date.getHours() + (date.getTimezoneOffset()/60)
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const days = Math.floor(timeInSeconds / (3600 * 24))
    let time = ''

    if (days > 0) {
        return time.concat(days + 'd').concat(' ').concat(hours + 'h').concat(' ').concat(minutes + 'm').concat(' ').concat(seconds + 's')
    }
    if (hours > 0) {
        return time.concat(hours + 'h').concat(' ').concat(minutes + 'm').concat(' ').concat(seconds + 's')
    }
    if (hours === 0 && minutes > 0) {
        return time.concat(minutes + 'm').concat(' ').concat(seconds + 's')
    }
    return seconds + ' s'
}