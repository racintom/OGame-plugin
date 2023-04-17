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