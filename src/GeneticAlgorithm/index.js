import {getDistance} from "geolib";
import selection from "./selection_methods"
import crossover1 from "./crossover_methods";
import mutation1 from "./mutation_methods";
import Graph from "./graph";
import axios from 'axios';

class GeneticAlgorithm {
    constructor(iteration_size, population_size, selection_method, crossover_method, startEnd, cities) {
        this.iteration_size = iteration_size;
        this.population_size = population_size;
        this.selection_method = selection_method;
        this.crossover_method = crossover_method;
        this.startEnd = startEnd;
        this.cities = cities;
        this.best = {"cost": Infinity};
        this.graph = null;
        this.population = [];
        this.is_initialized = false;
        this.iterator = 0;
        this.stopper = false;
    }

    roadPlanner = async (startPoint, endPoint) => {
        try {
            const url = `https://api.openstreetmap.org/api/0.6/directions?loc=${startPoint}&loc=${endPoint}`;
            const response = await axios.get(url);
            return response.data
        } catch (error) {
            console.error('Error fetching route data:', error);
        }
    };

    fitness(path) {
        let total_cost = 0;
        for (let i = 0; i < path.length - 1; i++) {
            // const road = this.roadPlanner([path[i].latitude, path[i].longitude], [path[i + 1].latitude, path[i + 1].longitude])
            // console.log(road)
            total_cost += getDistance(
                {latitude: path[i].latitude, longitude: path[i].longitude},
                {latitude: path[i + 1].latitude, longitude: path[i + 1].longitude})
        }
        return total_cost
    }

    initialize(graph) {
        while (this.population.length < this.population_size) {
            let random_path = graph.getRandomPathWithoutRevisiting(this.startEnd.start.plaka, this.startEnd.end.plaka)
            if (random_path.at(-1).plaka === this.startEnd.end.plaka) {
                let cost = this.fitness(random_path)
                this.population.push({
                    "path": random_path,
                    "cost": cost
                });
            }
        }
    }

    start(props) {
        setTimeout(() => {
            if (this.stopper)
                return

            if (!this.is_initialized) {
                this.graph = new Graph(this.cities);
                this.initialize(this.graph)
                this.is_initialized = true;
            }

            const selected = selection(this.selection_method, this.population, 0.5)
            const crossovered = crossover1(selected, this.fitness, this.population.length)
            if (!crossovered)
                this.start(props)
            this.population = mutation1(this.graph, crossovered, this.fitness, 0.7)
            const current_best = this.population.reduce((min, x) => x.cost < min ? x.cost : min);

            if (current_best.cost < this.best.cost) {
                props.setBest(current_best);
                this.best = current_best;
            }

            if (this.iterator < this.iteration_size) {
                this.iterator++;
                props.setIterator(this.iterator)
                this.start(props)
            } else
                props.setStatus(false);

        }, props.speed)
    }

    stop() {
        this.stopper = true;
    }

}

export default GeneticAlgorithm;