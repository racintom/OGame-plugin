import { getPlanetsForPlayer } from './planets.js';
export function addPlanetsToIconTooltipInGalaxyView() {
    document.querySelectorAll(`.galaxyRow.ctContentRow:not(.empty_filter)`).forEach(async (row) => {
        const cellActionEl = row.querySelector('.cellAction');
        const mailIcon = cellActionEl.querySelector('.sendMail');
        if (mailIcon != null) {
            cellActionEl.appendChild(generateHTMLIconForAllPlanetsInfo(await getPlanetsForPlayer(Number(mailIcon.dataset.playerid))));
        }
    });
}
export function attachHandlerToSendProbe() {
    document.querySelectorAll(`.galaxyRow.ctContentRow:not(.empty_filter)`).forEach(async (row) => {
        const cellActionEl = row.querySelector('.cellAction');
        const mailIcon = cellActionEl.querySelector('.sendMail');
        if (mailIcon != null) {
            cellActionEl.appendChild(generateHTMLIconForEspionageWithMoreProbes(Number(row.id.match(/\d+/)[0])));
        }
    });
}
function generateHTMLIconForEspionageWithMoreProbes(planetPosition) {
    const node = document.createElement('span');
    node.className = 'icon icon_eye hueRotate extension-custom-espionage-send-icon';
    node.onclick = () => {
        window.sendShips(window.constants.espionage, window.galaxy, window.system, planetPosition, 1, 6);
    };
    return node;
}
function generateHTMLIconForAllPlanetsInfo(data) {
    const { tooltip, textContainerInsideTooltip } = constructTooltipHTML();
    Object.values(data).forEach(data => {
        const [galaxy, system, planet] = extractPlanetCoordsFromStringifiedPlanetCoords(data.planetCoords);
        const div = document.createElement('div');
        const a = document.createElement('a');
        div.appendChild(a);
        a.textContent = data.planetCoords + '\t' + data.planetName + '\n';
        a.href = `${window.location.origin}/game/index.php?page=ingame&component=galaxy&galaxy=${galaxy}&system=${system}&position=${planet}`;
        textContainerInsideTooltip.appendChild(div);
    });
    const node = document.createElement('span');
    node.className = 'icon icon_info';
    node.onmouseenter = ev => {
        if (document.getElementById('extension-tooltip') == null) {
            tooltip.style.left = ev.clientX + 20 + 'px';
            tooltip.style.top = ev.clientY + 20 + 'px';
            document.body.appendChild(tooltip);
        }
    };
    return node;
}
function extractPlanetCoordsFromStringifiedPlanetCoords(coords) {
    return coords.split(':');
}
function constructTooltipHTML() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tpd-tooltip tpd-skin-cloud tpd-size-x-small extension-tooltip';
    tooltip.id = 'extension-tooltip';
    const child1 = document.createElement('div');
    child1.className = 'tpd-content-wrapper tpd-skin-cloud';
    child1.style.visibility = 'visible';
    child1.style.position = 'static';
    const child2 = document.createElement('div');
    child2.className = 'tpd-content-spacer tpd-background';
    const child3 = document.createElement('div');
    child3.className = 'tpd-content';
    const close = document.createElement('div');
    close.className = 'close-tooltip';
    close.onclick = () => {
        document.body.removeChild(tooltip);
    };
    child2.appendChild(child3);
    child2.appendChild(close);
    child1.appendChild(child2);
    tooltip.appendChild(child1);
    return { tooltip, textContainerInsideTooltip: child3 };
}
