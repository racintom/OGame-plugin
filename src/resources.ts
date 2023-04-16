import {extractPortionOfText, formatDate, removeCommasFromText, removeLettersFromNumber} from './utils.js'
import {Production} from './types'

export function resourceFormattingScript(event: MutationRecord[], production: Production) {
    if (event.find(ev => (ev.target as Element).classList.contains('insufficient'))) {
        insertRemainingTimeIntoDOMScript(production)
    }
    formatResourcesInSlideUpContainer()
    makeEnergyCostRedIfCurrentEnergyWouldNotSuffice(production.resources.energy.amount)
}

export function insertRemainingTimeIntoDOMScript(production: any) {
    const longestTime = calculatTimeTillEnoughResources(production)
    if(longestTime) {
        inserIntoDOMRemainingTime(longestTime)
    }
}

export function loadResourceProductionInSeconds() {
    const text = document.getElementById('resourcesbarcomponent')?.children[1]?.textContent?.trim()
    if (text == undefined) {
        return
    }
    return JSON.parse(extractPortionOfText(text, 'reloadResources(', ')'))
}

function makeEnergyCostRedIfCurrentEnergyWouldNotSuffice(currentEnergy: number) {
    const energyCost = document.querySelector<HTMLElement>('.additional_energy_consumption > .value')
    if (energyCost && Number(energyCost.dataset.value) > currentEnergy) {
        energyCost.classList.add('extension-red')
    }
}
function formatResourcesInSlideUpContainer() {
    const container = document.querySelector('.slide-up')
    if (container == null) {
        return
    }
    container.querySelectorAll('.resource').forEach(formatResources)
}


function formatResources(element: Element) {
    element.textContent = removeLettersFromNumber(element.ariaLabel!)
}

function calculateSecondsTillAchievablePrice(currentAmount: number, neededAmount: number | string, resourceProducedInSingleSecond: number) {
    // @ts-ignore
    return Math.ceil((neededAmount - currentAmount)/resourceProducedInSingleSecond)
}

function generateHTML(time: string): HTMLElement {
    const node = document.createElement("li");
    node.id = 'customTimeNeeded'
    node.innerHTML = `<strong>Remaining time: <span class="value" id='customTimeNeededValue'>${time}</span></strong>`
    return node
}

function inserIntoDOMRemainingTime(longestTime: string): void {
    if (document.getElementById('customTimeNeeded') === null) {
        document.querySelector('.slide-up .information ul')!.appendChild(generateHTML(longestTime))
    } else {
        document.getElementById('customTimeNeededValue')!.textContent = longestTime
    }
}

function calculatTimeTillEnoughResources(production: Production): string | undefined {
    const insufficientResources = document.querySelector('.slide-up .costs .insufficient')
    if (insufficientResources === null) {
        return
    }

    const currentMetal = parseInt(removeCommasFromText(document.getElementById('resources_metal')!.textContent!))
    const currentCrystal = parseInt(removeCommasFromText(document.getElementById('resources_crystal')!.textContent!))
    const currentDeuterium = parseInt(removeCommasFromText(document.getElementById('resources_deuterium')!.textContent!))

    const neededMetal = document.querySelector<HTMLElement>('.slide-up .costs .resource.metal')?.dataset?.value ?? 0
    const neededCrystal = document.querySelector<HTMLElement>('.slide-up .costs .resource.crystal')?.dataset?.value ?? 0
    const neededDeuterium = document.querySelector<HTMLElement>('.slide-up .costs .resource.deuterium')?.dataset?.value ?? 0

    if (resourcesAreAlreadyHarvestedAndDOMIsStale(
        neededMetal,
        currentMetal,
        neededCrystal,
        currentCrystal,
        neededDeuterium,
        currentDeuterium
    )) {
        return 'None. Refresh page'
    }

    const timeNeededForMetal = calculateSecondsTillAchievablePrice(
        currentMetal,
        neededMetal,
        production.resources.metal.production
    )

    const timeNeededForCrystal = calculateSecondsTillAchievablePrice(
        currentCrystal,
        neededCrystal,
        production.resources.crystal.production
    )

    const timeNeededForDeuterium = calculateSecondsTillAchievablePrice(
        currentDeuterium,
        neededDeuterium,
        production.resources.deuterium.production
    )

    const remainingTimeInSeconds = Math.max(timeNeededForMetal, timeNeededForCrystal, timeNeededForDeuterium)
    return formatDate(remainingTimeInSeconds)
}

function resourcesAreAlreadyHarvestedAndDOMIsStale(neededMetal: string | number, currentMetal: number, neededCrystal: string | number, currentCrystal: number, neededDeuterium: string | number, currentDeuterium: number) {
    return Number(neededMetal) < currentMetal && Number(neededCrystal) < currentCrystal && Number(neededDeuterium) < currentDeuterium
}
