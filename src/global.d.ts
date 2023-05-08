import {PlayerInfo} from './types'

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
    }
}


