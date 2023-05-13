import { callGet } from './api.js'
import {parsePlanetListFromAPIXML} from './parser.js'
import {SimplePlanetInfo} from './types'

export async function getPlanetsForPlayer(playerId: number): Promise<SimplePlanetInfo> {
    return parsePlanetListFromAPIXML(await callGet(`api/playerData.xml?id=${playerId}`), playerId)
}
