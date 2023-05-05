import {getDistance} from "geolib";
import selection from "./selection_methods"

class GeneticAlgorithm {
    constructor(iteration_size, population_size, selection_method, crossover_method, startEnd, cities) {
        this.iteration_size = iteration_size;
        this.population_size = population_size;
        this.selection_method = selection_method;
        this.crossover_method = crossover_method;
        this.startEnd = startEnd;
        this.cities = cities;
        this.best = 0;
        this.population = [];
    }

    random_path(start, end) {
        let start_point = this.cities.find(x => x.plaka === start)
        let current_city = start_point;
        let path = [start_point]
        for (let i = 0; i < this.cities.length - 1; i++) {
            while (path.some(x => x.plaka === current_city.plaka)) {
                const random_neighbor = current_city.komsular.sort(() => 0.5 - Math.random())[0];
                current_city = this.cities.find(x => x.plaka === random_neighbor)
            }
            path.push(current_city)
        }
        let target_index = path.findIndex(x => x.plaka === end)
        path = path.slice(0, target_index + 1)
        this.fitness(path)
        return path

    }

    fitness(path) {
        let total_cost = 0;
        for (let i = 0; i < path.length - 1; i++) {
            total_cost += getDistance(
                {latitude: path[i].latitude, longitude: path[i].longitude},
                {latitude: path[i + 1].latitude, longitude: path[i + 1].longitude})
        }
        return total_cost
    }

    initialize() {
        for (let i = 0; i < this.population_size; i++) {
            let random_path = this.random_path(6, 25);
            let cost = this.fitness(random_path)
            this.population.push({
                "path": random_path,
                "cost": cost
            });
        }
    }

    start() {
        this.initialize();
        selection(this.selection_method, this.population, 0.2)
        // setTimeout(() => {
        //     if (!this.is_initialized) {
        //         this.is_initialized = true;
        //         this.start()
        //     }
        // }, 1)
    }

}

export default GeneticAlgorithm;