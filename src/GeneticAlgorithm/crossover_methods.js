const pmx = () => {

}

const ox1 = () => {

}

const crossover1 = (selected, fitness_function, new_population_size) => {
    let not_matched_counter = 0;
    let new_population = []
    while (new_population.length < new_population_size) {
        let [p1, p2] = selected.sort(() => Math.random() - Math.random()).slice(0, 2)
        p1 = p1.path
        p2 = p2.path
        const match_cities = p1.slice(1, -1).filter(c1 => p2.slice(1, -1).some(c2 => c2.plaka === c1.plaka));
        if (!match_cities.length) {
            if (not_matched_counter < 50) {
                not_matched_counter++;
                continue
            }
            return false
        }
        const random_match = match_cities[Math.floor(Math.random() * match_cities.length)]

        const parent1_match_index = p1.findIndex(c => c.plaka === random_match.plaka)
        const parent2_match_index = p2.findIndex(c => c.plaka === random_match.plaka)

        let child1 = {"path": p1.slice(0, parent1_match_index).concat(p2.slice(parent2_match_index))}
        let child2 = {"path": p2.slice(0, parent2_match_index).concat(p1.slice(parent1_match_index))}
        child1["cost"] = fitness_function(child1["path"])
        child2["cost"] = fitness_function(child2["path"])
        new_population.push(child1)
        new_population.push(child2)
    }
    return new_population


}

export default crossover1