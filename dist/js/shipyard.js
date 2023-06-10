import { addThousandSeparatorsToNumber } from './utils.js';
export function renderCargoCapacityForSelectedAmountOfShipsInputChange(event) {
    renderCargoText(calculateMaximumCargoCapacity(Number(event.target.value), Number(event.target.parentElement.dataset.technology)), event.target.parentElement);
}
export function renderCargoCapacityForSelectedAmountOfShipsPictureClicked(event) {
    renderCargoText(calculateMaximumCargoCapacity(Number(event.target.nextElementSibling.value), Number(event.target.parentElement.dataset.technology)), event.target.parentElement);
}
export function attachNecessaryMaxButton(el) {
    if (el.parentElement.dataset.status === 'off') {
        return;
    }
    const node = document.createElement('span');
    node.className = 'send_all my-extension dropdown';
    node.appendChild(document.createElement('a'));
    el.appendChild(node);
    node.addEventListener('click', (e) => {
        e.stopPropagation();
        const shipId = Number(e.target.parentElement.parentElement.parentElement.dataset.technology);
        const shipsToSend = calculateHowManyShipsCanCarryAllCurrentResources(shipId);
        const inputElement = e.target.parentElement.parentElement.nextElementSibling;
        inputElement.value = shipsToSend + '';
        renderCargoCapacityForSelectedAmountOfShipsInputChange({ target: inputElement });
        inputElement.click();
        inputElement.focus();
        inputElement.blur();
    });
}
export function removeAllCargoLabels() {
    document.querySelectorAll('.extension-total-cargo').forEach(el => el.textContent = '');
}
function renderCargoText(totalCargo, container) {
    const existingCargoText = container.getElementsByClassName('extension-total-cargo')[0];
    if (existingCargoText == null) {
        const node = document.createElement('p');
        node.className = `extension-total-cargo ${isCargoEnoughToCarryAllCurrentResources(totalCargo) ? 'sufficient' : 'insufficient'}`;
        node.textContent = addThousandSeparatorsToNumber(totalCargo);
        container.appendChild(node);
    }
    else {
        existingCargoText.textContent = totalCargo > 0 ? addThousandSeparatorsToNumber(totalCargo) : '';
        existingCargoText.className = `extension-total-cargo ${isCargoEnoughToCarryAllCurrentResources(totalCargo) ? 'sufficient' : 'insufficient'}`;
    }
}
function calculateHowManyShipsCanCarryAllCurrentResources(shipId) {
    const neededShips = (window.resourcesBar.resources.metal.amount + window.resourcesBar.resources.crystal.amount + window.resourcesBar.resources.deuterium.amount) / window.shipsData[shipId].cargoCapacity;
    const availableShips = window.shipsOnPlanet.find(ship => ship.id === shipId).number;
    return Math.ceil(neededShips < availableShips ? neededShips : availableShips);
}
function calculateMaximumCargoCapacity(amountOfSelectedShips, shipId) {
    return window.shipsData[shipId].cargoCapacity * amountOfSelectedShips;
}
function isCargoEnoughToCarryAllCurrentResources(totalCargo) {
    return window.resourcesBar.resources.metal.amount + window.resourcesBar.resources.crystal.amount + window.resourcesBar.resources.deuterium.amount < totalCargo;
}
