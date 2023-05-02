// import {findNearest} from "geolib";

class GeneticAlgorithm {
    constructor(iteration_size, population_size, selection_method, crossover_method, startEnd, cities) {
        this.iteration_size = iteration_size;
        this.population_size = population_size;
        this.selection_method = selection_method;
        this.crossover_method = crossover_method;
        this.startEnd = startEnd;
        this.cities = cities;
        this.best = 0;
        this.counter = 0
        this.is_initialized = false;
        this.path_deep = 5;
        this.path = null;
    }

    random_path() {
        let start_point = this.cities.find(x => x.plaka === 6)
        let target_point = this.cities.find(x => x.plaka === 25)
        let current_city = start_point;
        let path = [start_point]
        for (let i = 0; i < this.path_deep; i++) {

            while (path.some(x => x.plaka === current_city.plaka)) {
                const random_neighbor = current_city.komsular.sort(() => 0.5 - Math.random())[0];
                current_city = this.cities.find(x => x.plaka === random_neighbor)
            }
            path.push(current_city)
        }
        return path

    }

    initialize() {
        this.path = this.random_path();
    }

    start() {
        this.initialize();

        // setTimeout(() => {
        //     if (!this.is_initialized) {
        //         this.is_initialized = true;
        //         this.start()
        //     }
        // }, 1)
    }

};
export default GeneticAlgorithm;