import { call } from "./api.js"
import { parsePage } from "./parser.js"
import {EspionageLog, EspionageMessage} from './types'

const MESSAGE_ID = -1
const TAB_ID = 6 //FAVORITES TAB
const ACTION = 107
const AJAX = 1
const STANDALONE_PAGE = 0

type EspionageLogSimple = Record<string, EspionageMessage>

export async function loadFavoriteEspionagePlayers(): Promise<EspionageLog> {
    //const cachedLogs = localStorage.getItem('espionage-logs')
    const cachedLogs = null
    if (cachedLogs === null || areLogsAreTooOld()) {
        const accumulatedData = transform(await fetchFavoriteEspionageMessages())
        localStorage.setItem('espionage-logs', JSON.stringify(accumulatedData))
        localStorage.setItem('espionage-logs-date', String(Date.now()))
        return accumulatedData
    } else {
        return JSON.parse(localStorage.getItem('espionage-logs')!) as EspionageLog
    }
}

export function putEspionageLogsIntoDOM(espionageLogs: EspionageLog) {
    const currentGalaxy = Number(document.querySelector<HTMLInputElement>('#galaxy_input')!.value)
    const currentSystem = Number(document.querySelector<HTMLInputElement>('#system_input')!.value)

    if (playerHasEspionageMessageInCurrentCoords(currentGalaxy, currentSystem, espionageLogs)) {
        const planetPositions = Object.keys(espionageLogs[currentGalaxy][currentSystem])
        planetPositions.forEach(planetPosition => {
            const e = document.querySelector(`#galaxyRow${planetPosition} > .cellAction`)!
            e.appendChild(generateHTMLForEspionageMessage(espionageLogs[currentGalaxy][currentSystem][planetPosition]))
        })
    }

}

function playerHasEspionageMessageInCurrentCoords(currentGalaxy: number, currentSystem: number, espionageLogs: EspionageLog): boolean {
    return espionageLogs[currentGalaxy] && espionageLogs[currentGalaxy][currentSystem] !== undefined
}

async function fetchFavoriteEspionageMessages(): Promise<EspionageLogSimple> {
    let accumulatedData: EspionageLogSimple = {}
    for(let i = 1 ; i > 0 ; i++) {
        const playerData = await fetchAllFavoriteEspionageMessages(i)
        if (messagesAreDuplicate(Object.values(accumulatedData), Object.values(playerData))) { // this include method is not correct IMHO. Should be improved and tested
            return accumulatedData
        }
        accumulatedData = {...accumulatedData, ...playerData}
    }
    return accumulatedData
}

function transform(data: EspionageLogSimple): EspionageLog {
    return Object.entries(data).reduce<EspionageLog>((accValue, [coord, val]) => {
        const [galaxy, system, planet] = coord.replace('[', '').replace(']', '').split(':')
        if (accValue[galaxy] === undefined) {
            accValue[galaxy] = { [system]: { [planet]: val } }
        } else {
            if (accValue[galaxy][system] === undefined) {
                accValue[galaxy][system] = { [planet]: val }
            } else {
                accValue[galaxy][system][planet] = val
            }
        }

        return accValue
    }, {})
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

function extractPlayerInfoFromParsedResponse(dom: Document): EspionageLogSimple {
    const messages: EspionageLogSimple = {}
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

function areLogsAreTooOld(): boolean {
    const halfMinuteThreshHold = 30 * 1000;
    const savedTime = Number(localStorage.getItem('espionage-logs-date'))
    return (Date.now() - savedTime) > halfMinuteThreshHold
}

function generateHTMLForEspionageMessage(data: EspionageMessage): HTMLSpanElement {
   const { tooltip, textContainerInsideTooltip } = constructTooltipHTML()


    Object.entries(data).forEach(([key, val]) => {
        const div = document.createElement('div')
        div.textContent = key + '\t' + val
        textContainerInsideTooltip.appendChild(div)
    })

    const node = document.createElement('span')
    node.className = 'icon icon_info'
    node.onmouseenter = ev => {
        tooltip.style.left = ev.clientX + 20 + 'px'
        tooltip.style.top = ev.clientY + 20 + 'px'
        document.body.appendChild(tooltip)
    }
    node.onmouseleave = () => {
        document.body.removeChild(tooltip)
    }

    return node
}

function constructTooltipHTML() {
    const tooltip = document.createElement('div')
    tooltip.className = 'tpd-tooltip tpd-skin-cloud tpd-size-x-small'

    const child1 = document.createElement('div')
    child1.className = 'tpd-content-wrapper tpd-skin-cloud'
    child1.style.visibility = 'visible'
    child1.style.position = 'static'

    const child2 = document.createElement('div')
    child2.className = 'tpd-content-spacer tpd-background'

    const child3 = document.createElement('div')
    child3.className = 'tpd-content'

    child2.appendChild(child3)
    child1.appendChild(child2)
    tooltip.appendChild(child1)


    return { tooltip, textContainerInsideTooltip: child3 }
}
