export function parsePage(page) {
    return stripSpecialCharactersThatFuckUpParsing(page);
}
function stripSpecialCharactersThatFuckUpParsing(page) {
    return page.replace(/Activity([\s\S]*?)minutes ago./gm, '')
        .replace(/<script([\s\S]*?)<\/script>/gm, '');
}
export function parsePlanetListFromAPIXML(text, playerId) {
    const planetsElements = new DOMParser().parseFromString(text, "text/xml").getElementsByTagName('planet');
    const planets = {};
    for (let i = 0; i < planetsElements.length; i++) {
        const info = {
            planetCoords: planetsElements[i].getAttribute('coords'),
            planetName: planetsElements[i].getAttribute('name')
        };
        planets[info.planetCoords] = info;
    }
    return planets;
}
