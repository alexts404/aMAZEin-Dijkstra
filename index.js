'use strict';

import { dijkstraWayOut, aStarWayOut, shortestPath } from './scripts/search.js';
import Maze from './scripts/mazeGenerator.js';

const WALLSIZE = 2;
let dijkstraArr = [];
let aStarArr = [];
let path = [];
let alreadyOut = false;
let inProgress = false;
let displayRate;
let size;
let maze;
let timeoutId;

$(() => {
  $('.slider').on('input', (e => {
    displayRate = e.target.value;
  }
  ));
  $('#create-form').on('submit', (e) => {
    e.preventDefault();
    generateMaze();
    alreadyOut = false;
    dijkstraArr = [];
    if (timeoutId) clearTimeout(timeoutId);
    // if (!displayRate) {
      $('.slider').val(Math.floor(1+ 2 * (size - 1)));
      displayRate = Math.floor(1 + 2 * (size - 1));
    // }
  });
  $('#dwo-btn').click(() => {
    if (!inProgress) {
      if (alreadyOut) {
        $('.tile').css('background-color', 'white');
        $('.tile').removeClass('purple');
      }
      if (maze) {
        inProgress = true;
        $('.user-container__button-container__fwo').addClass('inProgress');
        alreadyOut = true;
        dijkstraArr = dijkstraWayOut(maze);
        displayWayOut(dijkstraArr.slice());
      }
    }
  });
  $('#awo-btn').click(() => {
    if (alreadyOut) {
      $('.tile').css('background-color', 'white');
      $('.tile').removeClass('purple');
    }
    if (maze) {
      inProgress = true;
      $('.user-container__button-container__fwo').addClass('inProgress');
      alreadyOut=true;
      aStarArr = aStarWayOut(maze);
      displayWayOut(aStarArr.slice());
    }
  });
});

function displayWayOut (steps) {
  if (steps.length <= 0) {
    // $(':root').css('--color-visited', 'green');
    inProgress = false;
    $('.user-container__button-container__fwo').removeClass('inProgress');
    displayShortestPath();
    return;
  }
  $(':root').css('--color-visited', 'yellow');
  const currentTile = steps.shift();
  $(`#${currentTile}`).css('background-color', 'var(--color-visited)');
  timeoutId = setTimeout(() => displayWayOut(steps), 1000 / (2 * displayRate));
}

function displayShortestPath () {
  path = shortestPath();
  const tmpPath = path.slice();
  while (tmpPath.length > 0) {
    const currentTile = tmpPath.shift();
    $(`#${currentTile}`).addClass('purple');
  }
}




function generateMaze () {
  size = Number.parseInt($('#create-size').val());
  if (!size || size == NaN || size > 50 || size < 1)
  {
    alert('please input a valid number <= 50')
  } else {
    maze = new Maze(size).generate();
    const mazeArr = maze.arr;
    $('.maze').html('');
    let tileSize = Math.floor(Number.parseInt($('.maze-container').css('width')) / (2 * size));
    tileSize = tileSize > 40 ? 40 : (tileSize < 7 ? 7 : tileSize);
    $(':root').css({
      '--wall-thickness': 2 * WALLSIZE,
      '--tile-size': tileSize
    });
    const walls = ['upper', 'right', 'lower', 'left'];
    for (let position of walls) {
      const wall = $(`<div class="maze-border--${position}"></div>`);
      $('.maze').append($('<div class="startArrow">➡</div>'));
      $('.maze').append(wall);
    }
    for (let row = 0; row < size; row++) {
      let rowDiv = $(`<div></div>`);
      for (let col = 0; col < size; col++) {
        let index = size * row + col;
        let colDiv = $(`<div class="tile" id="${index}"></div>`);
        let connections = mazeArr[index].connections;
        let rightIndex = (index + 1) % size != 0 ? index + 1 : index;
        let bottomIndex = row + 1 < size ? index + size : index;
        if (connections.filter(node => node.id == bottomIndex).length == 0 && row + 1 < size) {
          colDiv.css({'border-bottom': WALLSIZE+'px solid black'});
        }
        if (connections.filter(node => node.id == rightIndex).length == 0 && col + 1 < size) {
          colDiv.css({'border-right': WALLSIZE+'px solid black'});
        }
        rowDiv.append(colDiv);
      }
      $('.maze').append(rowDiv);
      $('.tile').css('width',tileSize+'px');
      $('.tile').css('height',tileSize+'px');
    }
    $('.maze').append($('<div class="endArrow">🏁</div>'));
  }
}
