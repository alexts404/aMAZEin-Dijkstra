'use strict';

import PriorityQueue from './priority_queue.js';
const COST = 1;

let nodesVisited;
let nodesToVisit;


export function dijkstraWayOut (maze) {
  // fast fails
  if (!maze) throw new Error('no maze specified');
  if (!maze.start || !maze.end){
    throw new Error('invalid maze');
  }

  nodesVisited = [];
  nodesToVisit = new PriorityQueue();
  const clonedMaze = maze.deepCopy();
  clonedMaze.start.cost = 0;
  const start = {
    key: 0,
    value: clonedMaze.start,
  }
  dijkstraSearch(start, clonedMaze);
  return nodesVisited.map(node => node.id);
}

export function aStarWayOut (maze) {
  nodesVisited = [];
  nodesToVisit = new PriorityQueue();
  const enrichedMaze = maze.deepCopy();
  enrichedMaze._arr.forEach(node => {
    const row = Math.floor(Number(node.id) / maze.size);
    const col = Number(node.id) % maze.size;
    const endRow = maze.size - 1;
    const endCol = maze.size - 1;
    const manhattanDistance = (endRow - row) + (endCol - col);
    node.estimatedCost = manhattanDistance;
  })
  const start = {
    key: 0,
    value: enrichedMaze.start,
  }
  start.value.cost = 0;
  // console.log(enrichedMaze);
  dijkstraSearch(start, enrichedMaze);
  return nodesVisited.map(node => node.id);
}


function dijkstraSearch (node, maze) {

  // naive version (searches a tad too long)
  if (node.key == undefined) {
    // next node is unreachable
    // console.log('node is unreachable');
    return;
  }
  // console.log(node);
  const position = node.value;
  const neighbours = position.connections.filter(neighbour => neighbour.visited != true);
  //console.log(neighbours);
  for (let neighbour of neighbours) {
    const estimatedCostToGetThere = neighbour.estimatedCost ? neighbour.estimatedCost : 0;
    if (neighbour.cost === undefined || neighbour.cost > position.cost + COST) {
      // currently, the shortest route to neighbour is via node
      neighbour.cost = position.cost + COST;
      neighbour.predecessor = position;
      nodesToVisit.insert(neighbour.cost + estimatedCostToGetThere, neighbour);
    }
  }
  position.visited = true;
  nodesVisited.push(position);
  if (maze.end.visited == true) {
    // end of the maze has been reached
    //console.log('end has been visited')
    return;
  }
  const nextNode = nodesToVisit.dequeue();
  if (nextNode) dijkstraSearch(nextNode, maze);
  else return;
}


export function shortestPath (){
  // expects a list of visitedNodes as input. Returns the shortest path from start to end
  const path = [];
  let node = nodesVisited[nodesVisited.length - 1];
  console.log(node);
  while (node) {
    console.log(node);

    path.unshift(node);
    node = node.predecessor;
  }
  return path.map(node => node.id);

}
