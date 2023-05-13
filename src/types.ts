export type Resource = {
    production: number
    amount: number
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

export type SimplePlanetInfo = Record<string, { planetName: string ; planetCoords: string }>

export type PlanetsInfo = Record<string, PlanetInfo>

export type ShipInfo = {
    baseCargoCapacity: number
    baseFuelCapacity: number
    baseFuelConsumption: number
    baseSpeed: number
    cargoCapacity: number
    fuelCapacity: number
    fuelConsumption: number
    id: number
    name: string
    number: number
    recycleMode: number
    speed: number
}

export type ResourcesBar = {
    onClickActive: boolean
} & ProductionWithEnergy