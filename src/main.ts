import {
    loadResourceProductionInSeconds,
    resourceFormattingScript
} from "./resources.js";

import {
    loadFavoriteEspionagePlayers,
    putEspionageLogsIntoDOM
} from "./espionage.js"

import {
    attachBookmarkButton, renderBookmarks
} from './bookmark.js'
import {addPlanetListForEachPlayerInGalaxyView} from './planets.js'

(async function () {
    window.bookmarks = {}

    const production = loadResourceProductionInSeconds();
    // const planetsInfo = await getPlanetsInfo()
    // const espionageLogs = await loadFavoriteEspionagePlayers()

    const observerSlider = new MutationObserver( (event) => {
        const container = document.querySelector('.slide-up')
        if (container != null) {
            resourceFormattingScript(event, production)
            // attachBookmarkButton(production, planetsInfo)
        }
    });
    const slideUpContainer = document.getElementsByClassName('maincontent')[0]
    if (slideUpContainer) {
        observerSlider.observe(slideUpContainer, { attributes: false, childList: true, subtree: true });
    }

    // renderBookmarks(planetsInfo)

    const observerGalaxy = new MutationObserver( (event) => {
        if ((event[0].target as HTMLDivElement).style.display === 'none') {
            // putEspionageLogsIntoDOM(espionageLogs)
            addPlanetListForEachPlayerInGalaxyView()
        }
    });
    const galaxyContainer = document.getElementById('galaxyLoading')
    if (galaxyContainer) {
        observerGalaxy.observe(galaxyContainer, { attributes: true, childList: true, subtree: false });
    }

})()
