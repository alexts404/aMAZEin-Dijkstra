
import PriorityQueue from './priority_queue.js';
const COST = 1;

export function dijkstraWayOut (maze) {
  // fast fails
  if (!maze) throw new Error('no maze specified');
  if (!maze.start || !maze.end) throw new Error('invalid maze');
  const nodesToVisit = new PriorityQueue();
  const nodesVisited = [];
  maze.start.cost = 0;
  const start = {
    key: 0,
    value: maze.start,
  }
  start.cost = 0;
  function dijkstra (node) {
    // naive version (searches a tad too long)
    if (node.key == undefined) {
      // next node is unreachable
      // console.log('node is unreachable');
      return;
    }
    const position = node.value;
    const neighbours = position.connections.filter(neighbour => neighbour.visited != true);
    //console.log(neighbours);
    for (let neighbour of neighbours) {
      if (neighbour.cost == undefined || neighbour.cost > position.cost + COST) {
        // currently, the shortest route to neighbour is via node
        try {
          //nodesToVisit.delete(neighbour);
        } catch {}
        neighbour.cost = position.cost + COST;
        nodesToVisit.insert(neighbour.cost, neighbour);
        //console.log(nodesToVisit);
      }
    }
    position.visited = true;
    nodesVisited.push(position);
    if (maze.end.visited == true) {
      // end of the maze has been reached
      //console.log('end has been visited')
      return;
    }
    dijkstra(nodesToVisit.dequeue());
  }
  dijkstra(start);
  return nodesVisited;
}



