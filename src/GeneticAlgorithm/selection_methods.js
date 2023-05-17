const selection = (method, population, ratio) => {
    switch (method) {
        case 'roulette':
            return roulette_wheel_selection(population, ratio);
        case 'rank':
            return rank_selection(population, ratio);
        case 'tournament':
            return tournament_selection(population, ratio);
        case 'elitist':
            return elitist_selection(population, ratio);
        default:
            return null;
    }
}
const roulette_wheel_selection = (population, ratio) => {
    let selected_population = [];
    let new_population_count = parseInt(population.length * ratio);
    const total_fitness = population.reduce((acc, o) => acc + parseInt(o.cost), 0)
    for (let i = 0; i < new_population_count; i++) {
        const random_number = Math.random() * total_fitness;
        let sum = 0;
        for (let i = 0; i < population.length; i++) {
            sum += population[i].cost;
            if (sum > random_number){
                selected_population.push(population[i])
                break;
            }
        }
    }
    return selected_population
}

const rank_selection = (population, ratio) => {
    console.log("rank")
}

const tournament_selection = (population, ratio) => {
    console.log("tournament")
}

const elitist_selection = (population, ratio) => {
    console.log("elitist")
}

export default selection;