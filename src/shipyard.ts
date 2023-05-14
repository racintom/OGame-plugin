import {addThousandSeparatorsToNumber} from './utils.js'

export function renderCargoCapacityForSelectedAmountOfShipsInputChange(event: Event): void {
    renderCargoText(
        calculateMaximumCargoCapacity(Number((event.target as HTMLInputElement).value!), Number((event.target as HTMLInputElement).parentElement!.dataset.technology)),
        (event.target as HTMLInputElement).parentElement as HTMLSpanElement
    )
}
export function renderCargoCapacityForSelectedAmountOfShipsPictureClicked(event: Event): void {
    renderCargoText(
        calculateMaximumCargoCapacity(Number(((event.target as HTMLSpanElement).nextElementSibling as HTMLInputElement).value), Number((event.target as HTMLSpanElement).parentElement!.dataset.technology)),
        (event.target as HTMLInputElement).parentElement as HTMLSpanElement
    )
}

export function attachNecessaryMaxButton(el: HTMLSpanElement): void {
    if (el.parentElement!.dataset.status === 'off') {
        return
    }

    const node = document.createElement('span')
    node.className = 'send_all my-extension dropdown'
    node.appendChild(document.createElement('a'))

    el.appendChild(node)

    node.addEventListener('click', (e) => {
        e.stopPropagation();

        const shipId = Number((e.target as HTMLSpanElement).parentElement!.parentElement!.parentElement!.dataset.technology)
        const shipsToSend = calculateHowManyShipsCanCarryAllCurrentResources(shipId);
        const inputElement = (e.target as HTMLSpanElement).parentElement!.parentElement!.nextElementSibling as HTMLInputElement
        inputElement.value = shipsToSend + ''
        renderCargoCapacityForSelectedAmountOfShipsInputChange({ target: inputElement } as any)

        inputElement.click()
        inputElement.focus()
        inputElement.blur()
    })
}

export function removeAllCargoLabels(): void {
    document.querySelectorAll('.extension-total-cargo').forEach(el => el.textContent = '')
}

function renderCargoText(totalCargo: number, container: HTMLSpanElement): void {
    const existingCargoText = container.getElementsByClassName('extension-total-cargo')[0]
    if (existingCargoText == null) {
        const node = document.createElement('p')

        node.className = `extension-total-cargo ${isCargoEnoughToCarryAllCurrentResources(totalCargo) ? 'sufficient' : 'insufficient'}`
        node.textContent = addThousandSeparatorsToNumber(totalCargo)

        container.appendChild(node)
    } else {
        existingCargoText.textContent = totalCargo > 0 ? addThousandSeparatorsToNumber(totalCargo) : ''
        existingCargoText.className = `extension-total-cargo ${isCargoEnoughToCarryAllCurrentResources(totalCargo) ? 'sufficient' : 'insufficient'}`
    }
}


function calculateHowManyShipsCanCarryAllCurrentResources(shipId: number): number {
    const neededShips = (window.resourcesBar.resources.metal.amount + window.resourcesBar.resources.crystal.amount + window.resourcesBar.resources.deuterium.amount) / window.shipsData[shipId].cargoCapacity
    const availableShips = window.shipsOnPlanet.find(ship => ship.id === shipId)!.number
    return Math.ceil(neededShips < availableShips ? neededShips : availableShips)
}

function calculateMaximumCargoCapacity(amountOfSelectedShips: number, shipId: number): number {
    return window.shipsData[shipId].cargoCapacity * amountOfSelectedShips
}

function isCargoEnoughToCarryAllCurrentResources(totalCargo: number): boolean {
    return window.resourcesBar.resources.metal.amount + window.resourcesBar.resources.crystal.amount + window.resourcesBar.resources.deuterium.amount < totalCargo
}