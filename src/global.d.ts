export {}

declare global {
    const chrome: {
        runtime: {
            getURL: (url: string) => string
        }
    }

    interface Window {
        token: string
    }
}


