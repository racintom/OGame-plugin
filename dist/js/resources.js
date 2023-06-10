import { removeLettersFromNumber, calculateTimeTillEnoughResources, getCurrentResourcesAmount, startTimer } from './utils.js';
export function resourceFormattingScript(event) {
    if (event.find(ev => ev.target.classList.contains('insufficient'))) {
        updateTimeNeededForUpgrade();
    }
    formatResourcesInSlideUpContainer();
    makeEnergyCostRedIfCurrentEnergyWouldNotSuffice(window.resourcesBar.resources.energy.amount);
}
function updateTimeNeededForUpgrade() {
    const insufficientResources = document.querySelector('.slide-up .costs .insufficient:not(.population.resource)');
    if (insufficientResources === null) {
        return;
    }
    const remainingTimeInSeconds = calculateTimeTillEnoughResources(findCostsInDOM(), getCurrentResourcesAmount());
    inserIntoDOMRemainingTime(remainingTimeInSeconds);
}
export function findCostsInDOM() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const metalCost = Number((_c = (_b = (_a = document.querySelector('.slide-up .costs .resource.metal')) === null || _a === void 0 ? void 0 : _a.dataset) === null || _b === void 0 ? void 0 : _b.value) !== null && _c !== void 0 ? _c : 0);
    const crystalCost = Number((_f = (_e = (_d = document.querySelector('.slide-up .costs .resource.crystal')) === null || _d === void 0 ? void 0 : _d.dataset) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : 0);
    const deuteriumCost = Number((_j = (_h = (_g = document.querySelector('.slide-up .costs .resource.deuterium')) === null || _g === void 0 ? void 0 : _g.dataset) === null || _h === void 0 ? void 0 : _h.value) !== null && _j !== void 0 ? _j : 0);
    return { metal: metalCost, crystal: crystalCost, deuterium: deuteriumCost };
}
function makeEnergyCostRedIfCurrentEnergyWouldNotSuffice(currentEnergy) {
    const energyCost = document.querySelector('.additional_energy_consumption > .value');
    if (energyCost && Number(energyCost.dataset.value) > currentEnergy) {
        energyCost.classList.add('extension-red');
    }
}
function formatResourcesInSlideUpContainer() {
    document.querySelectorAll('.slide-up .resource').forEach(formatResources);
}
function formatResources(element) {
    element.textContent = removeLettersFromNumber(element.ariaLabel);
}
function generateHTML() {
    const node = document.createElement("li");
    node.id = 'customTimeNeeded';
    node.innerHTML = `<strong>Remaining time: <span class="value" id='customTimeNeededValue'></span></strong>`;
    return node;
}
function inserIntoDOMRemainingTime(longestTime) {
    document.querySelector('.slide-up .information ul').appendChild(generateHTML());
    startTimer(longestTime, document.getElementById('customTimeNeededValue'));
}
