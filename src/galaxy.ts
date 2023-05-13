import {SimplePlanetInfo} from './types'
import {getPlanetsForPlayer} from './planets.js'

export function addPlanetsToIconTooltipInGalaxyView(): void {
    document.querySelectorAll(`.galaxyRow.ctContentRow:not(.empty_filter)`).forEach( async row => {
        const cellActionEl = row.querySelector('.cellAction')!
        const mailIcon = cellActionEl.querySelector<HTMLAnchorElement>('.sendMail')
        if (mailIcon != null) {
            cellActionEl.appendChild(generateHTMLIcon(await getPlanetsForPlayer(Number(mailIcon.dataset.playerid))))
            // todo: change this to adding a text to the popup that is displayed when you click on planet in galaxy view
        }
    })
}

function generateHTMLIcon(data: SimplePlanetInfo): HTMLSpanElement {
   const { tooltip, textContainerInsideTooltip } = constructTooltipHTML()

    Object.values(data).forEach(data => {
        const div = document.createElement('div')
        div.textContent = data.planetCoords + '\t' + data.planetName + '\n'
        textContainerInsideTooltip.appendChild(div)
    })

    const node = document.createElement('span')
    node.className = 'icon icon_info'

    node.onmouseenter = ev => {
       if (document.getElementById('extension-tooltip') == null) {
           tooltip.style.left = ev.clientX + 20 + 'px'
           tooltip.style.top = ev.clientY + 20 + 'px'
           document.body.appendChild(tooltip)
       }
    }

    return node
}

function constructTooltipHTML() {
    const tooltip = document.createElement('div')
    tooltip.className = 'tpd-tooltip tpd-skin-cloud tpd-size-x-small extension-tooltip'
    tooltip.id = 'extension-tooltip'

    const child1 = document.createElement('div')
    child1.className = 'tpd-content-wrapper tpd-skin-cloud'
    child1.style.visibility = 'visible'
    child1.style.position = 'static'

    const child2 = document.createElement('div')
    child2.className = 'tpd-content-spacer tpd-background'

    const child3 = document.createElement('div')
    child3.className = 'tpd-content'

    const close = document.createElement('div')
    close.className = 'close-tooltip'

    close.onclick = () => {
        document.body.removeChild(tooltip)
    }

    child2.appendChild(child3)
    child2.appendChild(close)
    child1.appendChild(child2)
    tooltip.appendChild(child1)


    return { tooltip, textContainerInsideTooltip: child3 }
}
