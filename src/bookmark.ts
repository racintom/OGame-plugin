import type {BookmarkData, Bookmarks, PlanetInfo, PlanetsInfo, Production} from './types'
import {findCostsInDOM} from './resources.js'
import {
    calculateTimeTillEnoughResources,
    getCurrentDateInSeconds,
    getCurrentResourcesAmount,
    startTimer
} from './utils.js'

const BOOKMARKS_LOCAL_STORAGE = 'bookmarks'

export function attachBookmarkButton(production: Production, planetsInfo: PlanetsInfo) {
    addBookmarkButtonToSlideUpContainer(production, planetsInfo)
}

export function renderBookmarks(planetsInfo: PlanetsInfo) {
    addTimedBookmarksToPlanets(planetsInfo)
}

function addTimedBookmarksToPlanets(planetsInfo: PlanetsInfo): void {
    const bookmarks: Bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_LOCAL_STORAGE)! ?? null) ?? {}

    document.querySelectorAll('#planetList .planet-name').forEach(planetNameEl => {
        const planetName = planetNameEl.textContent!.trim()

        planetNameEl.parentElement!.append(...generateBookmarkHTML(bookmarks[planetName], planetName, planetsInfo[planetName]))
    })
}

function generateBookmarkHTML(bookmark: BookmarkData | undefined, planetName: string, planetInfo: PlanetInfo): Node[] {
    const node = document.createElement('div')
    node.id = planetName + 'extension-bookmark'
    node.className = 'extension-bookmark'
    node.textContent = bookmark?.building ?? ''

    const timeNode = document.createElement('div')
    timeNode.id = planetName + 'extension-bookmark-time'

    attachTimerToBookmark(planetInfo, bookmark, planetName, timeNode)

    return [node, timeNode]
}

function attachTimerToBookmark(planetInfo: PlanetInfo, bookmark: BookmarkData | undefined, planetName: string, timeNode: Element): void {

    if (planetInfo && bookmark) {
        const { metal: currentMetalAmount, crystal: currentCrystalAmount, deuterium: currentDeuteriumAmount } = planetInfo
        const remainingTime = calculateTimeTillEnoughResources({ resources: { metal: bookmark.metal, crystal: bookmark.crystal, deuterium: bookmark.deuterium }},
            { metal: bookmark.metalCost, crystal: bookmark.crystalCost, deuterium: bookmark.deuteriumCost },
            { metal: currentMetalAmount, crystal: currentCrystalAmount, deuterium: currentDeuteriumAmount }
        )
        if (remainingTime) {
            window.bookmarks[planetName] = startTimer(remainingTime - (getCurrentDateInSeconds() - bookmark.timeAgo), timeNode)
        }
    }

}

function addBookmarkButtonToSlideUpContainer(production: Production, planetsInfo: PlanetsInfo,): void {
    if (document.getElementById('extension_bookmark_btn') == null && cantUpgradeRightNow()) {
        document.querySelector('.slide-up .information')!.appendChild(generateBookmarkButtonHTML(production, planetsInfo))
    }
}

function generateBookmarkButtonHTML(production: Production, planetsInfo: PlanetsInfo): HTMLDivElement {
    const planetName = getCurrentlySelectedPlanetName()
    const bookMarkExists = bookmarkExistsForCurrentPlanet(planetName)
    const node = document.createElement('div')
    node.id = 'extension_bookmark_btn'
    node.className = 'bookmark btn_blue'
    node.textContent = bookMarkExists ? 'Remove Bookmark' : 'Add Bookmark'
    node.onclick = () => {
        if(bookmarkExistsForCurrentPlanet(planetName)) {
            removeBookmark(planetName)
            node.textContent = 'Add Bookmark'
        } else {
            saveBookmark(planetName, getDataForBookmark(production), getPlanetsInfoUpdatedWithCurrentPlanetInfo(planetName, planetsInfo)[planetName])
            node.textContent = 'Remove Bookmark'
        }
    }

    return node
}

function bookmarkExistsForCurrentPlanet(planetName: string): boolean {
    const bookMarks: Bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_LOCAL_STORAGE)! ?? null) ?? {}
    return bookMarks != null && bookMarks[planetName] !== undefined
}

function cantUpgradeRightNow(): boolean {
    return document.querySelector('.slide-up .build-it_premium') != null || document.querySelector('.slide-up .upgrade')!.hasAttribute('disabled')
}

function getDataForBookmark(production: Production): BookmarkData {
    const building = document.querySelector('.slide-up h3')!.textContent!
    const { metal: metalCost, crystal: crystalCost, deuterium: deuteriumCost } = findCostsInDOM()
    const planetName = getCurrentlySelectedPlanetName()

    return { planetName, timeAgo: getCurrentDateInSeconds(), building, metalCost, crystalCost, deuteriumCost, ...production.resources }
}

function saveBookmark(planetName: string, bookmark: BookmarkData, planetInfo: PlanetInfo): void {
    const bookMarks: Bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_LOCAL_STORAGE)! ?? null) ?? {}
    bookMarks[planetName] = bookmark
    localStorage.setItem(BOOKMARKS_LOCAL_STORAGE, JSON.stringify(bookMarks))

    document.getElementById(`${planetName}extension-bookmark`)!.textContent = bookmark.building
    attachTimerToBookmark(planetInfo, bookmark, planetName, document.getElementById(`${planetName}extension-bookmark-time`)!)
}

function removeBookmark(planetName: string): void {
    const bookMarks: Bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_LOCAL_STORAGE)!)
    bookMarks[planetName] = undefined
    localStorage.setItem(BOOKMARKS_LOCAL_STORAGE, JSON.stringify(bookMarks))

    clearInterval(window.bookmarks[planetName])

    document.getElementById(planetName + 'extension-bookmark')!.textContent = ''
    document.getElementById(planetName + 'extension-bookmark-time')!.textContent = ''
}

function getCurrentlySelectedPlanetName(): string {
    return document.querySelector('#planetList .planetlink.active .planet-name')!.textContent!
}

function getPlanetsInfoUpdatedWithCurrentPlanetInfo(planetName: string, planetsInfo: PlanetsInfo): PlanetsInfo {
    const currentPlanetInfo = planetsInfo[planetName]
    planetsInfo[planetName] = { ...currentPlanetInfo, ...getCurrentResourcesAmount()}

    return planetsInfo
}