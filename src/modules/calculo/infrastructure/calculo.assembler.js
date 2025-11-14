// API del módulo Cálculo
import api from '@/shared/infrastructure/base-api.js'
import { createEndpoint } from '@/shared/infrastructure/base-endpoint.js'

const endpoint = createEndpoint(import.meta.env.VITE_CALCULO_ENDPOINT)

export default {
    calculate(payload) {
        return api.post(`${endpoint}`, payload)
    }
}
