class Graph {
    constructor(cities) {
        this.cities = cities
        this.nodes = [];
        this.adjList = {};
        this.main()
    }

    addNode(node) {
        this.nodes.push(node);
        this.adjList[node] = [];
    }

    addEdge(node1, node2) {
        if (!this.adjList[node1])
            this.adjList[node1] = [];

        if (!this.adjList[node2])
            this.adjList[node2] = [];

        this.adjList[node1].push(node2);
        this.adjList[node2].push(node1);
    }

    getRandomPathWithoutRevisiting(start, end) {
        const start_city = this.cities.find(c => c.plaka === start)
        const path = [start_city];
        const visited = [start];
        let currentNode = start;

        while (currentNode !== end) {
            const neighbors = this.adjList[currentNode];
            const unvisitedNeighbors = neighbors.filter(neighbor => !visited.includes(neighbor));

            if (unvisitedNeighbors.length === 0)
                break;

            const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);
            const nextNode = unvisitedNeighbors[randomIndex];
            const city = this.cities.find(c => c.plaka === nextNode)
            path.push(city);
            visited.push(nextNode);
            currentNode = nextNode;
        }
        return path;
    };

    main() {
        this.cities.forEach(city => {
            this.addNode(city.plaka);
            city.komsular.forEach(n => {
                this.addEdge(city.plaka, n)
            })
        });
    }
}

export default Graph;