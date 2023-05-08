import { callGet } from './api.js'
import {parsePage, parsePlanetListFromAPIXML} from './parser.js'
import {PlanetsInfo, ResourceAmount, SimplePlanetInfo} from './types'
import {
    extractPortionOfText,
    getTimeConstrainedLocalStorageCache,
    removeCommasFromText,
    removeLettersFromNumber
} from './utils.js'

const PLANETS_LOCAL_STORAGE = 'planets-extension'
const PLANETS_LOCAL_STORAGE_TIME = 'planets-extension-time'

/*
export async function getPlanetsInfo(): Promise<PlanetsInfo> {
    const cache = getTimeConstrainedLocalStorageCache<PlanetsInfo>(PLANETS_LOCAL_STORAGE, PLANETS_LOCAL_STORAGE_TIME)
    if (cache) {
        return cache
    } else {
        const resources = await loadCurrentResourcesFromAllPlanetsFromAPI()
        localStorage.setItem(PLANETS_LOCAL_STORAGE, JSON.stringify(resources))
        localStorage.setItem(PLANETS_LOCAL_STORAGE_TIME, JSON.stringify(Date.now()))
        return resources
    }
}
*/

/*
async function loadCurrentResourcesFromAllPlanetsFromAPI(): Promise<PlanetsInfo> {
    // todo: fetch EMPIRE webpage and parse the DOM contents. There is method called createImperiumHTML and an argument is huge JSON that contains all data I need
    const endpointUrl = `game/index.php?page=standalone&component=empire`

    const empirePage = await callGet(endpointUrl)
    const planetsInfo = JSON.parse(extractPortionOfText(empirePage, 'createImperiumHtml("#mainWrapper", "#loading",', ', 0 )'))
    planetsInfo.planets.reduce((acc: any, planet: any) => {
        acc[planet.name] = planet.production.hourly
        return acc
    }, {})

    return await callAPIToGetCurrentResourcesOnAllPlanets({ })

}
*/

export function parseCurrentResourcesForPlanetById(doc: string): ResourceAmount {
    const dummyDoc = document.createElement('html')
    dummyDoc.innerHTML = doc
    const metal = removeCommasFromText(dummyDoc.querySelector<HTMLSpanElement>('#resources_metal')!.dataset.raw!)
    const crystal = removeCommasFromText(dummyDoc.querySelector<HTMLSpanElement>('#resources_crystal')!.dataset.raw!)
    const deuterium = removeCommasFromText(dummyDoc.querySelector<HTMLSpanElement>('#resources_deuterium')!.dataset.raw!)

    return { metal, crystal, deuterium }
}

export function addPlanetListForEachPlayerInGalaxyView(): void {
    document.querySelectorAll<HTMLAnchorElement>('#galaxyContent .sendMail').forEach(async row => {
        const planets = await getPlanetsForPlayer(Number(row.dataset.playerid))

    })
}

export async function getPlanetsForPlayer(playerId: number): Promise<SimplePlanetInfo> {
    return parsePlanetListFromAPIXML(await callGet(`api/playerData.xml?id=${playerId}`), playerId)
}
