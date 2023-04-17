import {
    loadResourceProductionInSeconds,
    insertRemainingTimeIntoDOMScript,
    resourceFormattingScript
} from "./resources.js";

import {
    loadFavoriteEspionagePlayers,
    putEspionageLogsIntoDOM
} from "./espionage.js"

(async function () {
    const production = loadResourceProductionInSeconds();

    const observerContainer = new MutationObserver((event) => resourceFormattingScript(event, production));
    const slideUpContainer = document.getElementsByClassName('maincontent')[0]
    if (slideUpContainer) {
        observerContainer.observe(slideUpContainer, { attributes: false, childList: true, subtree: true });
    }

    const observerCurrentResources = new MutationObserver(() => insertRemainingTimeIntoDOMScript(production))
    const currentResources = document.getElementById('resources')
    if (currentResources) {
        observerCurrentResources.observe(currentResources, { attributes: false, childList: true, subtree: true })
    }

    const espionageLogs = await loadFavoriteEspionagePlayers()

    if (document.getElementById('galaxycomponent') !== null) {
        putEspionageLogsIntoDOM(espionageLogs)
    }
})()
