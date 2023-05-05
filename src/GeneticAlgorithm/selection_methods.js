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
    population.map(x=>
        console.log(x.cost)
    )
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