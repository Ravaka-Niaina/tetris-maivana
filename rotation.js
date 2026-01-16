import { store } from "./store.js";

export function rotateTetromino () {
  if (store.activeTetromino === "square") return;

  const blocs = getBlocs();

  let pivot = null;
  if (store.activeTetromino === "stick") {
    pivot = getStickPivot();
  } else {
    const possibleCases = {
      capitalT: [
        {
          angles: [90, 270],
          twoNearestBlocs: [ [-1, 0], [1, 0] ],
        }, {
          angles: [0, 180],
          twoNearestBlocs: [ [0, -1], [0, 1] ],
        }
      ], 
      
      rightSnake: [
        {
          angles: [0, 180],
          twoNearestBlocs: [ [0, 1], [1, 0] ],
        }, {
          angles: [90, 270],
          twoNearestBlocs: [ [-1, 0], [0, 1] ],
        }
      ],

      leftSnake: [
        {
          angles: [0, 180],
          twoNearestBlocs: [ [0, -1], [1, 0] ],
        }, {
          angles: [90, 270],
          twoNearestBlocs: [ [-1, 0], [0, -1] ],
        }
      ],

      capitalJ: [
        {
          angles: [0],
          twoNearestBlocs: [ [-1, 0], [0, 1] ],
        }, {
          angles: [90],
          twoNearestBlocs: [ [-1, 0], [0, -1] ],
        }, {
          angles: [180],
          twoNearestBlocs: [ [0, -1], [1, 0] ],
        }, {
          angles: [270],
          twoNearestBlocs: [ [0, 1], [1, 0] ],
        }
      ],

      capitalL: [
        {
          angles: [0],
          twoNearestBlocs: [ [-1, 0], [0, -1] ],
        }, {
          angles: [90],
          twoNearestBlocs: [ [0, -1], [1, 0] ],
        }, {
          angles: [180],
          twoNearestBlocs: [ [1, 0], [0, 1] ],
        }, {
          angles: [270],
          twoNearestBlocs: [ [-1, 0], [0, 1]],
        }
      ],
    };
    pivot = getPivotGeneralized(possibleCases[store.activeTetromino]);
  }

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

function getPivotGeneralized (possibleCases) {
  for (let i = 0; i < possibleCases.length; i++) {
    const { angles, twoNearestBlocs, } = possibleCases[i];
    
    let isTheRightAngle = false;
    for (let u = 0; u < angles.length; u++) {
      if (store.tetrominoAngle === angles[u]) {
        isTheRightAngle = true;
        break;
      }
    }

    if (isTheRightAngle) {
      for (let y = 0; y < store.virtualBlocs.length; y++) {
        for (let x = 0; x < store.virtualBlocs[y].length; x++) {
          try {
            if (
              store.virtualBlocs[y][x] === 1
              && store.virtualBlocs[y + twoNearestBlocs[0][0]][x + twoNearestBlocs[0][1]] === 1
              && store.virtualBlocs[y + twoNearestBlocs[1][0]][x + twoNearestBlocs[1][1]] === 1
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