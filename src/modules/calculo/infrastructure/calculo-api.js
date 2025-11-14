// Convertir respuesta de API → entidad de dominio
import { CalculoEntity } from '../domain/models/calculo.entity.js'

export function toCalculoEntity(dto) {
    return new CalculoEntity({
        restaurant: dto.restaurant,
        distances: dto.distances,
        averageTime: dto.averageTime
    })
}
