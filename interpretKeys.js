import { 
    getLowestPossiblePosition, 
    applyLowestPossiblePosition 
} from "./lowestPossiblePosition.js";
import { store } from "./store.js";
import { moveBlocs, stopBlocs, } from "./moveBlocs.js";
import { renderBlocsContainer } from "./rendering.js";
import { spawnRandomTetromino } from "./spawnTetromino.js";
import { rotateTetromino } from "./rotation.js";

function showGameOver () {
  const gameOverDiv = document.getElementById("game-over");
  gameOverDiv.style.display = "flex";
}

export function assertGameOver () {
  const isInsertOK = spawnRandomTetromino();
  if (!isInsertOK) {
    showGameOver();
    clearInterval(store.idMovingTimeInterval);
    store.isGameOver = true;
    return true;
  }

  return false;
}

export function interpretRightMove () {
  let isBlocAtExtremeRight = false;
  let isBlocTouchingNonMovingBloc = false;
  for (let i = 0; i < store.virtualBlocs.length; i++) {
    if (store.virtualBlocs[i][store.virtualBlocs[i].length - 1] === 1) {
      isBlocAtExtremeRight = true;
      break;
    }
    for (let u = 0; u < store.virtualBlocs[i].length - 1; u++) {
      if (store.virtualBlocs[i][u] === 1 && store.virtualBlocs[i][u + 1] === 2) {
        isBlocTouchingNonMovingBloc = true;
      }
    }
  }

  //just move the blocs
  if (!isBlocAtExtremeRight && !isBlocTouchingNonMovingBloc) {
    for (let i = 0; i < store.virtualBlocs.length; i++) {
      for (let u = store.virtualBlocs[i].length - 1; u > 0; u--) {
        if (store.virtualBlocs[i][u - 1] === 1) {
          store.virtualBlocs[i][u] = 1;
          store.virtualBlocs[i][u - 1] = 0;
        }
      }
    }
  }
}

export function interpretLeftMove () {
  let isBlocAtExtremeLeft = false;
  let isBlocTouchingNonMovingBloc = false;
  for (let i = 0; i < store.virtualBlocs.length; i++) {
    if (store.virtualBlocs[i][0] === 1) {
      isBlocAtExtremeLeft = true;
      break;
    }
    for (let u = 0; u < store.virtualBlocs[i].length - 1; u++) {
      if (store.virtualBlocs[i][u] === 2 && store.virtualBlocs[i][u + 1] === 1) {
        isBlocTouchingNonMovingBloc = true;
      }
    }
  }

  if (!isBlocAtExtremeLeft && !isBlocTouchingNonMovingBloc) {
    for (let i = 0; i < store.virtualBlocs.length; i++) {
      for (let u = 0; u < store.virtualBlocs[i].length - 1; u++) {
        if (store.virtualBlocs[i][u + 1] === 1) {
          store.virtualBlocs[i][u] = 1;
          store.virtualBlocs[i][u + 1] = 0;
        }
      }
    }
  }
}

export function interpretDownMove () {
  if (store.isGameOver === true) return;
  
  clearInterval(store.idMovingTimeInterval);
  const lowestPossiblePosition = getLowestPossiblePosition();
  applyLowestPossiblePosition(lowestPossiblePosition);

  // add another blocs
  if (!assertGameOver()) {
    // move the newly added bloc
    store.idMovingTimeInterval = setInterval(() => {
      const result = moveBlocs(stopBlocs, store.virtualBlocs);
      if (result !== true) {
        assertGameOver();
      }
      renderBlocsContainer();
    }, store.speed);
    
  } 
}

export function interpretUpButton () {
  rotateTetromino();
}