import {Production, ResourceAmount} from './types'

export function extractPortionOfText(wholeText: string, fromString: string, toString: string): string {
    const indexFrom = wholeText.indexOf(fromString)
    const indexTo = wholeText.indexOf(toString, indexFrom)

    return wholeText.substring(indexFrom + fromString.length, indexTo)
}

export function removeCommasFromText(text: string): number {
    if (text.includes('Mn')) {
        return Number(text.replace(/Mn/gm, '')) * 1000000
    }
    return Number(text.replace(/,/g, ''))
}

export function removeLettersFromNumber(numberWithLetters: string): string {
    return numberWithLetters.replace(/[a-zA-Z]-*/g, '').trim()
}

export function formatDate(timeInSeconds: number): string {
    const date = new Date(timeInSeconds * 1000)

    const hours = date.getHours() + (date.getTimezoneOffset()/60)
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const days = Math.floor(timeInSeconds / (3600 * 24))
    let time = ''

    if (days > 0) {
        return time.concat(days + 'd').concat(' ').concat(hours + 'h').concat(' ').concat(minutes + 'm').concat(' ').concat(seconds + 's')
    }
    if (hours > 0) {
        return time.concat(hours + 'h').concat(' ').concat(minutes + 'm').concat(' ').concat(seconds + 's')
    }
    if (hours === 0 && minutes > 0) {
        return time.concat(minutes + 'm').concat(' ').concat(seconds + 's')
    }
    return seconds + ' s'
}

export function getCurrentDateInSeconds(): number {
    return new Date().getTime() / 1000
}

export function calculateSecondsTillAchievablePrice(currentAmount: number, neededAmount: number | string, resourceProducedInSingleSecond: number) {
    // @ts-ignore
    return Math.ceil((neededAmount - currentAmount)/resourceProducedInSingleSecond)
}

export function calculateTimeTillEnoughResources(production: Production,
                                                 { metal: metalCost, crystal: crystalCost, deuterium: deuteriumCost }: ResourceAmount,
                                                 { metal: currentMetal, crystal: currentCrystal, deuterium: currentDeuterium }: ResourceAmount
                                                 ): number {
    if (resourcesAreAlreadyHarvestedAndDOMIsStale(
        metalCost,
        currentMetal,
        crystalCost,
        currentCrystal,
        deuteriumCost,
        currentDeuterium
    )) {
        return 0
    }

    const timeNeededForMetal = calculateSecondsTillAchievablePrice(
        currentMetal,
        metalCost,
        production.resources.metal.production
    )

    const timeNeededForCrystal = calculateSecondsTillAchievablePrice(
        currentCrystal,
        crystalCost,
        production.resources.crystal.production
    )

    const timeNeededForDeuterium = calculateSecondsTillAchievablePrice(
        currentDeuterium,
        deuteriumCost,
        production.resources.deuterium.production
    )

    return Math.max(timeNeededForMetal, timeNeededForCrystal, timeNeededForDeuterium)
}

export function startTimer(duration: number, display: Node): number {
    var start = Date.now(),
        diff;
    function timer() {
        // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        display.textContent = formatDate(diff);

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
    }
    // we don't want to wait a full second before the timer starts
    timer();
    return setInterval(timer, 1000);
}

export function resourcesAreAlreadyHarvestedAndDOMIsStale(neededMetal: number, currentMetal: number, neededCrystal: number, currentCrystal: number, neededDeuterium: number, currentDeuterium: number) {
    return neededMetal < currentMetal && neededCrystal < currentCrystal && neededDeuterium < currentDeuterium
}

export function getCurrentResourcesAmount(): ResourceAmount {
    const currentMetal = removeCommasFromText(document.getElementById('resources_metal')!.textContent!)
    const currentCrystal = removeCommasFromText(document.getElementById('resources_crystal')!.textContent!)
    const currentDeuterium = removeCommasFromText(document.getElementById('resources_deuterium')!.textContent!)

    return { metal: currentMetal, crystal: currentCrystal, deuterium: currentDeuterium }
}

export function getTimeConstrainedLocalStorageCache<T>(dataKey: string, timeKey: string): T | null {
    const halfMinuteThreshHold = 30 * 1000;
    const savedTime = Number(localStorage.getItem(timeKey))
    const isStale = (Date.now() - savedTime) > halfMinuteThreshHold

    if (isNaN(savedTime)) { // cache doesnt exist
        return null
    }
    if (isStale) {
        return null
    }

    return JSON.parse(localStorage.getItem(dataKey) ?? null as any) as T
}