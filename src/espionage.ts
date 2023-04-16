import { call } from "./api.js"
import { parsePage } from "./parser.js"
import {EspionageLog, EspionageMessage} from './types'

const MESSAGE_ID = -1
const TAB_ID = 6 //FAVORITES TAB
const ACTION = 107
const AJAX = 1
const STANDALONE_PAGE = 0

export async function loadFavoriteEspionagePlayers() {
    if (areLogsAreTooOld()) {
        const accumulatedData = await fetchFavoriteEspionageMessages()
        localStorage.setItem('espionage-logs', JSON.stringify(accumulatedData))
        localStorage.setItem('espionage-logs-date', new Date().toTimeString())
    }
}

export function putEspionageLogsIntoDOM() {

}

async function fetchFavoriteEspionageMessages(): Promise<EspionageLog> {
    let accumulatedData: EspionageLog = {}
    for(let i = 1 ; i > 0 ; i++) {
        const playerData = await fetchAllFavoriteEspionageMessages(i)
        if (messagesAreDuplicate(Object.values(accumulatedData), Object.values(playerData))) { // this include method is not correct IMHO. Should be improved and tested
            return accumulatedData
        }
        accumulatedData = {...accumulatedData, ...playerData}
    }
    return accumulatedData
}

function messagesAreDuplicate(existingMessages: EspionageMessage[], newMessages: EspionageMessage[]) {
    const existingMessagesDates = existingMessages.map(m => m.date)
    const newMessagesDates = newMessages.map(m => m.date)
    return newMessagesDates.every(newMessage => existingMessagesDates.includes(newMessage))
}

async function fetchAllFavoriteEspionageMessages(pagination: number) {
    return extractPlayerInfoFromParsedResponse(
        parsePage(await call("index.php?page=messages&tab=6&ajax=1", {
            messageId: MESSAGE_ID,
            tabId: TAB_ID,
            action: ACTION,
            pagination,
            ajax: AJAX,
            standalonePage: STANDALONE_PAGE,
        }))
    )

}

function extractPlayerInfoFromParsedResponse(dom: Document): EspionageLog {
    const messages: EspionageLog = {}
    const domMessages = dom.querySelectorAll('.msg')
    domMessages.forEach(message => {
        const [planetName, coordinates] = message.querySelector('.msg_title figure')!.nextSibling!.textContent!.split(' ')!
        const playerName = message.querySelector('.msg_content .status_abbr_active, .msg_content .compacting > .status_abbr_honorableTarget')!.textContent!.trim()
        const date = message.querySelector('.msg_date.fright')!.textContent!
        const resources: EspionageMessage['resources'] = []
        message.querySelectorAll('.msg_content .compacting:nth-last-child(-n+3) .ctn.ctn4').forEach(resource => resources.push(resource.textContent!))
        messages[coordinates] = { date, playerName, coordinates, planetName, resources }
    })
    return messages
}

function areLogsAreTooOld() {
    const oneminute = 60 * 1000;
    const savedtime = localStorage.getItem('espionage-logs-date');
    // @ts-ignore
    const difference = (new Date() - new Date(savedtime) ) / oneminute;

    if (savedtime === null) {   // logs dont exist
        return true
    } else {
        return difference > 1
    }
}

