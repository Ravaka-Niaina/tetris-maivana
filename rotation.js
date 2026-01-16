import { store } from "./store.js";

export function rotateTetromino () {
  const blocks = getTetrominoBlocks();
  const pivot = getPivot();
  const newBlocks = getTetrominoNewBlocsPositions(blocks, pivot);
  
  if (areBlocsInsideContainer(newBlocks)) {
    blocks.forEach(([y, x]) => {
      store.virtualBlocs[y][x] = 0;
    });

    newBlocks.forEach(([y, x]) => {
      store.virtualBlocs[y][x] = 1;
    });
    
    store.tetrominoAngle = (store.tetrominoAngle + 90) % 360;
  }
}

function areBlocsInsideContainer (blocks) {
  for (let i = 0; i < blocks.length; i++) {
    const [y, x] = blocks[i];
    if (y < 0 || y >= 20 || x < 0 || x >= 10) return false;
  }
  return true;
}

function getTetrominoBlocks () {
  if (store.activeTetromino === "stick") {
    for (let y = 0; y < store.virtualBlocs.length; y++) {
      for (let x = 0; x < store.virtualBlocs[y].length; x++) {
        if (store.virtualBlocs[y][x] === 1) {
          // the tetromino is vertical
          if (store.tetrominoAngle === 90 || store.tetrominoAngle === 270
          ) {
            return [ [y, x], [y + 1, x], [y + 2, x], [y + 3, x] ];
          }
          // the tetromino is horizontal
          return [ [y, x], [y, x + 1], [y, x + 2], [y, x + 3] ];
        }
      }
    }
  }
}

function getTetrominoNewBlocsPositions (blocks, pivot) {
  return blocks.map(([y,x]) => {
    const dy = y - pivot[0];
    const dx = x - pivot[1];

    return [
      Math.round(pivot[0] - dx),
      Math.round(pivot[1] + dy)
    ];
  });
}

function getPivot () {
  if (store.activeTetromino === "stick") {
    const [y, x] = getStickFirstBloc();
    return (store.tetrominoAngle === 90 || store.tetrominoAngle === 270)
    ? [y + 0.5, x + 1.5]
    : [y + 1.5, x + 0.5];
  }
}

function getStickFirstBloc () {
  let minY = Infinity;
  let minX = Infinity;

  for (let y = 0; y < store.virtualBlocs.length; y++) {
    for (let x = 0; x < store.virtualBlocs[y].length; x++) {
      if (store.virtualBlocs[y][x] === 1) {
        minY = Math.min(minY, y);
        minX = Math.min(minX, x);
      }
    }
  }

  return [minY, minX];
}