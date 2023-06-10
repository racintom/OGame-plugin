import { callGet } from './api.js';
import { parsePlanetListFromAPIXML } from './parser.js';
export async function getPlanetsForPlayer(playerId) {
    return parsePlanetListFromAPIXML(await callGet(`api/playerData.xml?id=${playerId}`), playerId);
}
