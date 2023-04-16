export function parsePage(page: string): Document {
    page = stripSpecialCharactersThatFuckUpParsing(page)
    return new DOMParser().parseFromString(page, "text/xml")
}

function stripSpecialCharactersThatFuckUpParsing(page: string): string {
    return page.replace(/Activity([\s\S]*?)minutes ago./gm, '') // todo: If I want to preserve the activity information as well, I have to edit this regex
        .replace(/\|<<</gm, '<').replace(/>>>\|/gm, '>').replace(/<</gm, '<').replace(/>>/gm, '>')
        .replace(/icon_apikey([\s\S]*?)><\/span>/gm, '"></span>')
        .replace(/href="([\s\S]*?)"/gm, '')
        .replace(/<script([\s\S]*?)<\/script>/gm, '')
        .replace(/<img([\s\S]*?)>/gm, '')
}