export type Resource = {
    production: number
}

export type ResourceAmount = {
    metal: number
    crystal: number,
    deuterium: number
}

export type Production = {
    resources: {
        metal: Resource
        crystal: Resource
        deuterium: Resource
    }
}
export type ProductionWithEnergy = Production & { resources : {
        energy: Resource & { amount: number }
    }
}

type PlanetRecord = Record<string, EspionageMessage>
type SystemRecord = Record<string, PlanetRecord>
export type EspionageLog = Record<string, SystemRecord>

export type EspionageMessage = {
    playerName: string
    planetName: string
    date: string,
    resources: string[]
    coordinates: string
}

export type Bookmarks = Record<string, BookmarkData | undefined>

export type BookmarkData = {
    planetName: string
    building: string
    metalCost: number
    crystalCost: number
    deuteriumCost: number
    metal: Resource
    crystal: Resource
    deuterium: Resource
    timeAgo: number
}

export type PlayerInfo = {
    playerId: number
    name: string
    hasCommander: boolean
    hasAPassword: boolean
}

export type PlanetInfo = {
    planetName: string
    planetId: number
} & ResourceAmount

export type SimplePlanetInfo = Record<string, { planetName: string ; planetId: number ; planetCoords: string }>

export type PlanetsInfo = Record<string, PlanetInfo>
