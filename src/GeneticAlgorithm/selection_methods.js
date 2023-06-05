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
    const totalFitness = population.reduce((total, i) => total + 1/i.cost, 0);
    const probabilities = population.map(i => 1/i.cost / totalFitness);

    for (let i = 0; i < new_population_count; i++) {
        const randomNumber = Math.random();
        let cumulativeProbability = 0;
        for (let i = 0; i < population.length; i++) {
            cumulativeProbability += probabilities[i];
            if (randomNumber <= cumulativeProbability) {
                selected_population.push(population[i]);
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
    population.sort((a, b) => a.cost - b.cost)
    return population.slice(0, parseInt(population.length * ratio, 10))
}

export default selection;