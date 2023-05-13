import {
    resourceFormattingScript
} from "./resources.js";

import {
    addPlanetsToIconTooltipInGalaxyView
} from "./galaxy.js"
import {
    renderCargoCapacityForSelectedAmountOfShipsPictureClicked,
    renderCargoCapacityForSelectedAmountOfShipsInputChange, attachNecessaryMaxButton
} from './shipyard.js'


(async function () {
    window.bookmarks = {}

    const observerSlider = new MutationObserver( (event) => {
        const container = document.querySelector('.slide-up')
        if (container != null) {
            resourceFormattingScript(event)
        }
    });
    const slideUpContainer = document.getElementsByClassName('maincontent')[0]
    if (slideUpContainer) {
        observerSlider.observe(slideUpContainer, { attributes: false, childList: true, subtree: true });
    }

    const observerGalaxy = new MutationObserver( (event) => {
        if ((event[0].target as HTMLDivElement).style.display === 'none') {
            addPlanetsToIconTooltipInGalaxyView()
        }
    });
    const galaxyContainer = document.getElementById('galaxyLoading')
    if (galaxyContainer) {
        observerGalaxy.observe(galaxyContainer, { attributes: true, childList: true, subtree: false });
    }

    const shipyardContainer = document.getElementById('shipsChosen')
    if (shipyardContainer) {
        document.querySelectorAll('#shipsChosen input').forEach(el => el.addEventListener('input', event => setTimeout(() => renderCargoCapacityForSelectedAmountOfShipsInputChange(event), 20)))
        document.querySelectorAll('#shipsChosen .icon').forEach(el => {
            el.addEventListener('click', event => setTimeout(() => renderCargoCapacityForSelectedAmountOfShipsPictureClicked(event), 20))
            attachNecessaryMaxButton(el as HTMLSpanElement)
        })
    }// todo: add button to shipyard images to use only as necessary transporters

})()
