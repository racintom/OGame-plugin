import type {AvailableShip, PlayerInfo, ResourcesBar, ShipInfo} from './types'

export {}

declare global {
    const chrome: {
        runtime: {
            getURL: (url: string) => string
        }
    }

    interface Window {
        token: string
        player: PlayerInfo
        bookmarks: Record<string, number>
        shipsData: Record<string, ShipInfo>
        shipsOnPlanet: AvailableShip[]
        resourcesBar: ResourcesBar
        shipsToSend: { id: number ; number: number}[]
    }
}


