// Pinia store base para el módulo Cálculo
import { defineStore } from 'pinia'

export const useCalculoStore = defineStore('calculo', {
    state: () => ({
        personas: [],
        restaurantes: [
            { id: 1, nombre: 'KFC Megaplaza', latitud: -11.9896, longitud: -77.0616 },
            { id: 2, nombre: 'KFC Cinépolis', latitud: -11.9923, longitud: -77.0589 },
            { id: 3, nombre: 'KFC Gamarra', latitud: -12.0567, longitud: -77.0201 }
        ],
        top3: [],
        calculoRealizado: false,
        loading: false,
    }),

    actions: {
        agregarPersona(persona) {
            this.personas.push({
                ...persona,
                id: Date.now(),
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(persona.nombre)}&background=random`
            })
        },

        eliminarPersona(id) {
            this.personas = this.personas.filter(p => p.id !== id)
        },

        agregarRestaurante(restaurante) {
            this.restaurantes.push({
                ...restaurante,
                id: Date.now()
            })
        },

        eliminarRestaurante(id) {
            this.restaurantes = this.restaurantes.filter(r => r.id !== id)
        },

        calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
            const R = 6371; // Radio de la Tierra en km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        },

        calcularTop3() {
            if (this.personas.length === 0) {
                return { success: false, message: 'Debes agregar al menos una persona' }
            }

            const resultados = this.restaurantes.map(restaurante => {
                const distancias = this.personas.map(persona => {
                    return this.calcularDistanciaHaversine(
                        persona.latitud,
                        persona.longitud,
                        restaurante.latitud,
                        restaurante.longitud
                    )
                })
                const distanciaPromedio = distancias.reduce((a, b) => a + b, 0) / distancias.length

                return {
                    id: restaurante.id,
                    nombre: restaurante.nombre,
                    distanciaPromedio,
                    distancias
                }
            })

            // Ordenar por distancia promedio ascendente
            resultados.sort((a, b) => a.distanciaPromedio - b.distanciaPromedio)

            this.top3 = resultados.slice(0, 3)
            this.calculoRealizado = true

            return { success: true }
        },

        setLoading(value) {
            this.loading = value
        }
    }
})
