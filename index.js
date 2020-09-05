import findWayOut from './scripts/dijkstra.js';
import Maze from './scripts/mazeGenerator.js';
// import { PriorityQueue } from './scripts/priority_queue';

// const myQueue = new PriorityQueue();

const WALLSIZE = 2;
let dijkstraArr = [];
let size;
let maze;

$(() => {
  $('#create-form').on('submit', (e) => {
    e.preventDefault();
    generateMaze();
  });
  $('.fwo-btn').click(() => {
    if (maze) {
      dijkstraArr = findWayOut(maze);
      dijkstraMyWayOut();
    }
  });
});

function dijkstraMyWayOut () {
  if (dijkstraArr.length <= 0) return;
  const currentTile = dijkstraArr.shift();
  $(`#${currentTile.name}`).css('background-color', 'yellow');
  setTimeout(() => dijkstraMyWayOut(), ((1000 / size) > 50 ? (1000 / size) : 50));
}


function generateMaze () {
  size = Number.parseInt($('#create-size').val());
  if (!size || size == NaN || size > 30 || size < 1)
  {
    alert('please input a valid number <= 30')
  } else {
    maze = new Maze(size).generate();
    const mazeArr = maze.arr;
    $('.maze').html('');
    let tileSize = Math.floor(Number.parseInt($('.maze-container').css('width')) / (2 * size));
    tileSize = tileSize > 40 ? 40 : tileSize;
    for (let row = 0; row < size; row++) {
      let rowDiv = $(`<div></div>`);
      for (let col = 0; col < size; col++) {
        let index = size * row + col;
        let colDiv = $(`<div class="tile" id="${index}"></div>`);
        let connections = mazeArr[index].connections;
        let rightIndex = (index + 1) % size != 0 ? index + 1 : index;
        let bottomIndex = row + 1 < size ? index + size : index;
        if (connections.filter(node => node.name == bottomIndex).length == 0 && row + 1 < size) {
          colDiv.css({'border-bottom': WALLSIZE+'px solid black'});
        }
        if (connections.filter(node => node.name == rightIndex).length == 0 && col + 1 < size) {
          colDiv.css({'border-right': WALLSIZE+'px solid black'});
        }
        //outer walls
        if (row == 0) colDiv.css({'border-top': 2 * WALLSIZE + 'px solid black'});
        if (col == 0 && row != 0) colDiv.css({'border-left': 2 * WALLSIZE + 'px solid black'});
        if (col == size - 1 && row != size - 1) colDiv.css({'border-right': 2*WALLSIZE + 'px solid black'});
        if (row == size - 1) colDiv.css({'border-bottom': 2 * WALLSIZE + 'px solid black'});
        rowDiv.append(colDiv);

      }
      $('.maze').append(rowDiv);
      $('.tile').css('width',tileSize+'px');
      $('.tile').css('height',tileSize+'px');
    }
  }
}
