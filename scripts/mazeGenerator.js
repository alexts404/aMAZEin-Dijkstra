class Node {
  constructor (name = null, connectedNode = undefined) {
    this.name = name;
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
    this._start = null;
    this._end = null;
    this._arr = []
    this.generate();
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
        //console.log(candidates);
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
      //oldNode = newNode;
      newNode = new Node(rdIdx, oldNode);
      oldNode.connections.push(newNode);
      this._arr[rdIdx] = newNode;
      stack.push(rdIdx);
      filled++;
    }
    this._start = this._arr[0];
    this._end = this._arr[area - 1];
    return this;
  }

  get start () {
    return this._start;
  }

  get end () {
    return this._end;
  }

  get arr () {
    return this._arr;
  }

}

export default Maze;
