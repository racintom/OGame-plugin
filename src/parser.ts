import {SimplePlanetInfo} from './types'

export function parsePage(page: string): string {
    return stripSpecialCharactersThatFuckUpParsing(page)
}

function stripSpecialCharactersThatFuckUpParsing(page: string): string {
    return page.replace(/Activity([\s\S]*?)minutes ago./gm, '')
        .replace(/<script([\s\S]*?)<\/script>/gm, '')
}

export function parsePlanetListFromAPIXML(text: string, playerId: number): SimplePlanetInfo {
    const planetsElements = new DOMParser().parseFromString(text,"text/xml").getElementsByTagName('planet')
    const planets: SimplePlanetInfo = {}

    for (let i = 0 ; i < planetsElements.length ; i++) {
        planets[playerId] = {
            planetCoords: planetsElements[i].getAttribute('coords')!,
            planetId: Number(planetsElements[i].getAttribute('id')),
            planetName: planetsElements[i].getAttribute('name')!
        }
    }

    return planets
}