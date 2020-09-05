
import PriorityQueue from './priority_queue.js';
const COST = 1;

// class PQNode {
//   constructor (key, value, left = null, right = null, parent = null) {
//     this.key = key;
//     this.value = value;
//     this.left = left;
//     this.right = right;
//     this.parent = parent;
//   }
// }

// class PriorityQueue {
//   constructor (head = null) {
//     this.head = head;
//     this.size = 0;
//     if (head) this.size++;
//   }

//   // helper methods

//   _findNode (position) {
//     let current = this.head;
//     // let previous = null;
//     // let lastDir = 'left';
//     let directions = position;
//     let pos = (1 << (Math.floor(Math.log2(position)) - 1));
//     while (pos > 0) {
//       // previous = current;
//       if (directions == (directions | pos)) {
//         current = current.right;
//         //lastDir = 'right';
//       } else {
//         current = current.left;
//         //lastDir = 'left';
//       }
//       pos = (pos >> 1);
//     }
//     // return { current, previous, lastDir };
//     return current;
//   }

//   _swap (node1, node2) {
//     [node1.key, node2.key] = [node2.key, node1.key];
//     [node1.value, node2.value] = [node2.value, node1.value];
//   }

//   _sinkIn (node) {
//     if (node.left && node.left.key < node.key) {
//       this._swap(node, node.left);
//       this._sinkIn(node.left);
//     } else if (node.right && node.right.key < node.key) {
//       this._swap(node, node.right);
//       this._sinkIn(node.right);
//     }
//   }

//   _reheap (node) {
//     let current = node;
//     while (current && current.parent && (current.key < current.parent.key)) {
//       current = current.parent;
//     }

//     if (current != node) {
//       [current.value, node.value] = [node.value, current.value];
//       [current.key, node.key] = [node.key, current.key];
//     }
//   }



//   insert (key, value) {
//     this.size++;
//     const newNode = new PQNode(key, value);
//     if (this.size == 1) {
//       this.head = newNode;
//     } else {
//       const insertionNode = this._findNode(this.size >>1);
//       if (this.size % 2 == 0) insertionNode.left = newNode;
//       else insertionNode.right = newNode;
//       newNode.parent = insertionNode;

//       this._reheap(newNode);
//     }
//   }

//   delete (node) {
//     if (this.size == 0) return null;
//     const lastNode = this._findNode(this.size);
//     this.size--;
//     if (lastNode == this.head) {
//       this.head = null;
//       return;
//     }
//     const parent = lastNode.parent;
//     if (parent.left == lastNode) parent.left = null;
//     else parent.right = null;
//     node.key = lastNode.key;
//     node.value = lastNode.value;
//     this._sinkIn(node);
//   }

//   dequeue () {
//     const elementToReturn = {  key: this.head.key,
//       value: this.head.value};
//     this.delete(this.head);
//     return elementToReturn;
//   }


// }


//export default PriorityQueue;





function findWayOut (maze) {
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


export default findWayOut;
