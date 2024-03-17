import { HttpResponse, http, delay } from "msw"
import { server } from "./mocks/server"

const simulateDelay = (endpoint: string) => {
    server.use(http.get(endpoint, async () => {
        await delay()

        return HttpResponse.json([])
    }))
}

const simulateError = (endpoint: string) => {
    server.use(http.get(endpoint, () => HttpResponse.error()))
}

export {
    simulateDelay, simulateError
}