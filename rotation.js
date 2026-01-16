import { store } from "./store.js";

export function rotateTetromino () {
  if (store.activeTetromino === "square") return;

  const getTetrominoBlocs = {
    stick: getStickBlocs,
    capitalT: getBlocs,
    rightSnake: getBlocs,
    leftSnake: getBlocs,
  }
  console.log(store.activeTetromino);
  const blocs = getTetrominoBlocs[store.activeTetromino]();

  const getPivot = {
    stick: getStickPivot,
    capitalT: getCapitalTPivot,
    rightSnake: getRightSnakePivot,
    leftSnake: getLeftSnakePivot,
  };
  const pivot = getPivot[store.activeTetromino]();

  const newBlocs = getTetrominoNewBlocsPositions(blocs, pivot);
  
  if (areBlocsInsideContainer(newBlocs)) {
    blocs.forEach(([y, x]) => {
      store.virtualBlocs[y][x] = 0;
    });

    newBlocs.forEach(([y, x]) => {
      store.virtualBlocs[y][x] = 1;
    });
    
    store.tetrominoAngle = (store.tetrominoAngle + 90) % 360;
  }
}

function areBlocsInsideContainer (blocs) {
  for (let i = 0; i < blocs.length; i++) {
    const [y, x] = blocs[i];
    if (y < 0 || y >= 20 || x < 0 || x >= 10) return false;
  }
  return true;
}

function getStickBlocs () {
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

function getBlocs () {
  const blocs = [];
  for (let y = 0; y < store.virtualBlocs.length; y++) {
    for (let x = 0; x < store.virtualBlocs[y].length; x++) {
      store.virtualBlocs[y][x] === 1 && blocs.push([y, x]);

      if (blocs.length === 4) return blocs;
    }
  }
  
  // this return should never be called because there are 4 active blocs
  return blocs;
}

function getTetrominoNewBlocsPositions (blocs, pivot) {
  return blocs.map(([y,x]) => {
    const dy = y - pivot[0];
    const dx = x - pivot[1];

    return [
      Math.round(pivot[0] - dx),
      Math.round(pivot[1] + dy)
    ];
  });
}

function getStickPivot () {
  const [y, x] = getStickFirstBloc();

  return (store.tetrominoAngle === 90 || store.tetrominoAngle === 270)
  ? [y + 0.5, x + 1.5]
  : [y + 1.5, x + 0.5];
}

// the pivot is the middle block or the 2nd block
function getCapitalTPivot () {
  // the tetronimo is vertical

  if ((store.tetrominoAngle === 90 || store.tetrominoAngle === 270)) {
    for (let y = 0; y < store.virtualBlocs.length; y++) {
      for (let x = 0; x < store.virtualBlocs[y].length; x++) {
        try {
          if (
            store.virtualBlocs[y][x] === 1 
            && store.virtualBlocs[y - 1][x] === 1
            && store.virtualBlocs[y + 1][x] === 1
          ) {
            return [y, x];
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  } else {
    for (let y = 0; y < store.virtualBlocs.length; y++) {
      for (let x = 0; x < store.virtualBlocs[y].length; x++) {
        try {
          if (
            store.virtualBlocs[y][x] === 1 
            && store.virtualBlocs[y][x - 1] === 1
            && store.virtualBlocs[y][x + 1] === 1
          ) {
            return [y, x];
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
} 

// the pivot is the middle block or the 2nd block
function getRightSnakePivot () {
  if (store.tetrominoAngle === 0 || store.tetrominoAngle === 180) {
    for (let y = 0; y < store.virtualBlocs.length; y++) {
      for (let x = 0; x < store.virtualBlocs[y].length; x++) {
        try {
          if (
            store.virtualBlocs[y][x] === 1
            && store.virtualBlocs[y][x + 1] === 1
            && store.virtualBlocs[y + 1][x] === 1
          ) {
            return [y, x];
          }
        } catch(err) {
          console.error(err);
        }
      }
    }
  } else {
    for (let y = 0; y < store.virtualBlocs.length; y++) {
      for (let x = 0; x < store.virtualBlocs[y].length; x++) {
        try {
          if (
            store.virtualBlocs[y][x] === 1
            && store.virtualBlocs[y - 1][x] === 1
            && store.virtualBlocs[y][x + 1] === 1
          ) {
            return [y, x];
          }
        } catch(err) {
          console.error(err);
        }
      }
    }
  }
}

// the pivot is the middle block or the 2nd block
function getLeftSnakePivot () { 
   if (store.tetrominoAngle === 0 || store.tetrominoAngle === 180) {
    for (let y = 0; y < store.virtualBlocs.length; y++) {
      for (let x = 0; x < store.virtualBlocs[y].length; x++) {
        try {
          if (
            store.virtualBlocs[y][x] === 1
            && store.virtualBlocs[y][x - 1] === 1
            && store.virtualBlocs[y + 1][x] === 1
          ) {
            return [y, x];
          }
        } catch(err) {
          console.error(err);
        }
      }
    }
  } else {
    for (let y = 0; y < store.virtualBlocs.length; y++) {
      for (let x = 0; x < store.virtualBlocs[y].length; x++) {
        try {
          if (
            store.virtualBlocs[y][x] === 1
            && store.virtualBlocs[y - 1][x] === 1
            && store.virtualBlocs[y][x - 1] === 1
          ) {
            return [y, x];
          }
        } catch(err) {
          console.error(err);
        }
      }
    }
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