'use strict'

class Node {
  constructor (id = null, connectedNode = undefined) {
    this.id = id;
    if (connectedNode == undefined) {
      this.connections = [];
    } else {
      this.connections = [connectedNode];
    }
  }
}

class Maze {
  constructor (size) {
    this.size = size;
    this._arr = []
  }

  generate () {
    const size = this.size;
    const area = this.size * this.size;
    this._arr = Array(area).fill(0);
    let filled = 0;
    const stack = [];
    let rdIdx = Math.floor(Math.random() * area);
    this._arr[rdIdx] = new Node(rdIdx);
    let oldNode;
    let newNode  = this._arr[rdIdx];
    stack.push(rdIdx);
    this._arr[rdIdx] = newNode;
    filled++;
    while (filled < area) {
      let candidates = [];
      while (candidates.length == 0) {
        if ((rdIdx - size) >= 0 && !this._arr[rdIdx - size]) candidates.push(rdIdx - size);
        if (((rdIdx + 1) % size) != 0 && !this._arr[rdIdx + 1]) candidates.push(rdIdx +1);
        if ((rdIdx % size) != 0 && !this._arr[rdIdx - 1]) candidates.push(rdIdx - 1);
        if ((rdIdx + size) < area && !this._arr[rdIdx + size]) candidates.push(rdIdx + size);
        if (candidates.length == 0) {
          rdIdx = stack.pop();
        }
      }
      // we now have a new unused index
      // add it to the maze!
      oldNode = this._arr[rdIdx];
      rdIdx = candidates[Math.floor(Math.random() * candidates.length)];
      newNode = new Node(rdIdx, oldNode);
      oldNode.connections.push(newNode);
      this._arr[rdIdx] = newNode;
      stack.push(rdIdx);
      filled++;
    }
    return this;
  }

  get start () {
    return this._arr[0];
  }

  get end () {
    return this._arr[this.size * this.size - 1];
  }

  get arr () {
    return this._arr;
  }

  deepCopy () {
    const clonedMaze = new Maze(this.size);
    // initial step: copy maze._arr with ids
    for (let i = 0; i < this._arr.length; i++) {
      const node = this._arr[i];
      const clonedNode = new Node (node.id);
      for (let connection of node.connections) {
        clonedNode.connections.push(connection.id);
      }
      clonedMaze._arr.push(clonedNode);
    }
    // completion: map ids to nodes
    for (let node of clonedMaze._arr) {
      node.connections = node.connections.map(connectionId =>
        clonedMaze._arr[connectionId]);
    }
    return clonedMaze;
  }

}

export default Maze;
