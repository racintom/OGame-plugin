import {
    extractPortionOfText,
    removeLettersFromNumber,
    calculateTimeTillEnoughResources,
    getCurrentResourcesAmount, startTimer
} from './utils.js'
import {Production, ProductionWithEnergy, ResourceAmount} from './types'

export function resourceFormattingScript(event: MutationRecord[]) {
    if (event.find(ev => (ev.target as Element).classList.contains('insufficient'))) {
        updateTimeNeededForUpgrade()
    }
    formatResourcesInSlideUpContainer()
    makeEnergyCostRedIfCurrentEnergyWouldNotSuffice(window.resourcesBar.resources.energy.amount)
}

function updateTimeNeededForUpgrade(): void {
    const insufficientResources = document.querySelector('.slide-up .costs .insufficient:not(.population.resource)')
    if (insufficientResources === null) {
        return
    }
    const remainingTimeInSeconds = calculateTimeTillEnoughResources(findCostsInDOM(), getCurrentResourcesAmount())
    inserIntoDOMRemainingTime(remainingTimeInSeconds)
}

export function findCostsInDOM(): ResourceAmount {
    const metalCost = Number(document.querySelector<HTMLElement>('.slide-up .costs .resource.metal')?.dataset?.value ?? 0)
    const crystalCost = Number(document.querySelector<HTMLElement>('.slide-up .costs .resource.crystal')?.dataset?.value ?? 0)
    const deuteriumCost = Number(document.querySelector<HTMLElement>('.slide-up .costs .resource.deuterium')?.dataset?.value ?? 0)

    return {metal: metalCost, crystal: crystalCost, deuterium: deuteriumCost}
}

function makeEnergyCostRedIfCurrentEnergyWouldNotSuffice(currentEnergy: number) {
    const energyCost = document.querySelector<HTMLElement>('.additional_energy_consumption > .value')
    if (energyCost && Number(energyCost.dataset.value) > currentEnergy) {
        energyCost.classList.add('extension-red')
    }
}
function formatResourcesInSlideUpContainer() {
    document.querySelectorAll('.slide-up .resource')!.forEach(formatResources)
}


function formatResources(element: Element) {
    element.textContent = removeLettersFromNumber(element.ariaLabel!)
}



function generateHTML(): HTMLElement {
    const node = document.createElement("li");
    node.id = 'customTimeNeeded'
    node.innerHTML = `<strong>Remaining time: <span class="value" id='customTimeNeededValue'></span></strong>`
    return node
}

function inserIntoDOMRemainingTime(longestTime: number): void {
    document.querySelector('.slide-up .information ul')!.appendChild(generateHTML())
    startTimer(longestTime, document.getElementById('customTimeNeededValue')!)
}
