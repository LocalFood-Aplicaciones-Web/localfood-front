// Entidad base para representar un resultado de cálculo
export class CalculoEntity {
    constructor({ restaurant, distances, averageTime }) {
        this.restaurant = restaurant
        this.distances = distances
        this.averageTime = averageTime
    }
}
