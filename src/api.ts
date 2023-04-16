export function call(url: string, body: Record<string, any>= {}) {
    body = { ...body, token: window.token }

    const data = new FormData();
    Object.entries(body).forEach(([key, val]) => data.append(key, val))

    return window.fetch(`${window.location.protocol}//${window.location.hostname}/game/${url}`, {
        method: 'POST',
        body: data
    }).then((response) => response.body)
        .then((rb) => {
            if (rb === null) {
                throw new DOMException('Readable stream is null')
            }
            const reader = rb.getReader();

            return new ReadableStream({
                start(controller) {
                    // The following function handles each data chunk
                    function push() {
                        // "done" is a Boolean and value a "Uint8Array"
                        reader.read().then(({ done, value }) => {
                            // If there is no more data to read
                            if (done) {
                                controller.close();
                                return;
                            }
                            // Get the data and send it to the browser via the controller
                            controller.enqueue(value);
                            // Check chunks by logging to the console
                            push();
                        });
                    }

                    push();
                },
            });
        }).then((stream) =>
            // Respond with our stream
            new Response(stream, { headers: { "Content-Type": "text/html" } }).text()
        )
        .then((result) => {
            // Do things with result
            return result;
        });
}