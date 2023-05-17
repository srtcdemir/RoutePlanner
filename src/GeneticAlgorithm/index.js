import {getDistance} from "geolib";
import selection from "./selection_methods"
import crossover1 from "./crossover_methods";
import mutation1 from "./mutation_methods";
import Graph from "./graph";

class GeneticAlgorithm {
    constructor(iteration_size, population_size, selection_method, crossover_method, startEnd, cities) {
        this.iteration_size = iteration_size;
        this.population_size = population_size;
        this.selection_method = selection_method;
        this.crossover_method = crossover_method;
        this.startEnd = startEnd;
        this.cities = cities;
        this.best = 0;
        this.crossovered = []
        this.population = [];
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

    initialize(graph) {
        while (this.population.length < this.population_size) {
            let random_path = graph.getRandomPathWithoutRevisiting(6, 25)
            if (random_path.at(-1).plaka === 25) {
                let cost = this.fitness(random_path)
                this.population.push({
                    "path": random_path,
                    "cost": cost
                });
            }
        }
    }

    start() {
        const graph = new Graph(this.cities);
        this.initialize(graph)
        let iterator = 0;
        while (iterator < this.iteration_size) {
            let selected = selection(this.selection_method, this.population, 0.1)
            let crossovered = crossover1(selected, this.fitness, 20)
            this.crossovered=structuredClone(crossovered);
            if (!crossovered)
                continue;
            mutation1(graph, crossovered, 0.6)
            iterator++;
        }
        // setTimeout(() => {
        //     if (!this.is_initialized) {
        //         this.is_initialized = true;
        //         this.start()
        //     }
        // }, 1)
    }

}

export default GeneticAlgorithm;