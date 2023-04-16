export type Resource = {
    production: number
    amount: number
}

export type Production = {
    resources: {
        metal: Resource
        crystal: Resource
        deuterium: Resource
        energy: Resource
    }
}

export type EspionageLog = Record<string, EspionageMessage>

export type EspionageMessage = {
    playerName: string
    planetName: string
    date: string,
    resources: string[]
    coordinates: string
}