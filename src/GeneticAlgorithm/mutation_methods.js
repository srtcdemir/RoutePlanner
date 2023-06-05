const mutation1 = (graph, population, fitness, ratio) => {
    for (let i = 0; i < parseInt(population.length * 0.1, 10); i++) {
        const random_path_index = Math.floor(Math.random() * population.length)
        const random_path = population[random_path_index].path
        const mutation_length = Math.floor(random_path.length * ratio);

        const random_start_index = 1 + Math.floor(Math.random() * (random_path.length - mutation_length - 2))
        const start_city = random_path[random_start_index]
        const target_city = random_path[random_start_index + mutation_length]

        let mutation_path = null
        while (true) {
            mutation_path = graph.getRandomPathWithoutRevisiting(start_city.plaka, target_city.plaka)
            if (mutation_path.at(-1).plaka === target_city.plaka)
                break
        }

        const clone_path = population[random_path_index].path.filter((c, index) => index < random_start_index || index > random_start_index + mutation_length)
        clone_path.splice(random_start_index,0,...mutation_path)
        population[random_path_index].path = clone_path
        population[random_path_index].cost = fitness(population[random_path_index].path)
    }

    return population
}

export default mutation1