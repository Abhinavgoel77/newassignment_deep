const fs = require('fs');

function readConnectionsFromFile(filePath) {
  const fileData = fs.readFileSync(filePath, 'utf8');
  return parseConnections(fileData);
}

function parseConnections(data) {
  const lines = data.split('\n');
  const connections = {};

  for (const line of lines) {
    const [fromNode, toNodesString] = line.split('->').map(str => str.trim());
    const toNodes = toNodesString ? toNodesString.split(',').map(node => node.trim()) : [];

    connections[fromNode] = toNodes;
  }
  let completeGraph = {};

    for (const vertex in connections) {
        completeGraph[vertex] = connections[vertex]; // Copy existing edges

        // Add reverse edges for each vertex's neighbors
        for (const neighbor of connections[vertex]) {
            if (!completeGraph[neighbor]) {
                completeGraph[neighbor] = [];
            }
            if (!completeGraph[neighbor].includes(vertex)) {
                completeGraph[neighbor].push(vertex);
            }
        }
    }
    // console.log(completeGraph);
  return completeGraph;
}

function dijkstra(graph, source) {
    const vertices = Object.keys(graph);
    // console.log(vertices);
    const dist = {};
    const visited = new Set();

    for (const vertex of vertices) {
        dist[vertex] = vertex === source ? 0 : Infinity;
    }

    while (visited.size < vertices.length) {
        let minDistVertex = null;
        for (const vertex of vertices) {
            if (!visited.has(vertex) && (minDistVertex === null || dist[vertex] < dist[minDistVertex])) {
                minDistVertex = vertex;
            }
        }

        visited.add(minDistVertex);

        for (const neighbor of graph[minDistVertex]) {
            if (!visited.has(neighbor)) {
                dist[neighbor] = Math.min(dist[neighbor], dist[minDistVertex] + 1); // Corrected line
            }
        }
    }
    console.log(dist);

    for (const key in dist) {
        if(key == targetNode)
        console.log("the dist is",dist[key]);
    }
    return dist;
}
function main() {
  const filePath = 'connections.txt';
  const target = process.argv[3];
  const [startNode, targetNode] = target.split(',');
  const connections = readConnectionsFromFile(filePath);
//   console.log(connections);

  const distance = dijkstra(connections,startNode);

  if (distance === Infinity) {
    console.log(`No path found between ${startNode} and ${targetNode}`);
  } else {
    console.log(`Distance between ${startNode} and ${targetNode}: ${distance}`);
  }
}

main();
