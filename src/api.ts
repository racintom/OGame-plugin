export function callPost(url: string, body: Record<string, any> = {}) {
    body = { ...body, token: window.token }

    const data = new FormData();
    Object.entries(body).forEach(([key, val]) => data.append(key, val))

    return window.fetch(`${window.location.protocol}//${window.location.hostname}/${url}`, {
        method: 'POST',
        body: data
    }).then((response) => response.text())
}

export function callGet(url: string) {
    return window.fetch(`${window.location.protocol}//${window.location.hostname}/${url}`, {
        method: 'GET'
    }).then(response => response.text())
}