const mutation1 = (graph, population, ratio) => {
    const random_path = population[Math.floor(Math.random() * population.length)].path
    const mutation_length = Math.floor(random_path.length * ratio);


    const random_start_index = 1 + Math.floor(Math.random() * (random_path.length - mutation_length - 2))
    const start_city = random_path[random_start_index]
    const target_city = random_path[random_start_index + mutation_length]

    let new_path = null
    while (true) {
        new_path = graph.getRandomPathWithoutRevisiting(start_city.plaka, target_city.plaka)
        if (new_path.at(-1).plaka === target_city.plaka)
            break
    }
    console.log("Mutation:", mutation_length,new_path.length)
}

export default mutation1