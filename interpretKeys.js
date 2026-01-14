import { 
    getLowestPossiblePosition, 
    applyLowestPossiblePosition 
} from "./lowestPossiblePosition.js";
import { store } from "./store.js";
import { moveBlocs, stopBlocs, } from "./moveBlocs.js";
import { renderBlocsContainer } from "./rendering.js";

function showGameOver () {
  const gameOverDiv = document.getElementById("game-over");
  gameOverDiv.style.display = "flex";
}

// fonction mampiditra blocs
export function insertBlocs (blocName) {

  if (blocName === "l") {
    if (
      store.virtualBlocs[0][4] === 2
      || store.virtualBlocs[1][4] === 2
      || store.virtualBlocs[2][4] === 2
      || store.virtualBlocs[2][5] === 2
    ) {
      return false;
    }

    store.virtualBlocs[0][4] = 1;
    store.virtualBlocs[1][4] = 1;
    store.virtualBlocs[2][4] = 1;
    store.virtualBlocs[2][5] = 1;

    return true;
  } else if (blocName === "inverse-l") {
    if (
      store.virtualBlocs[0][5] === 2
      || store.virtualBlocs[1][5] === 2
      || store.virtualBlocs[2][5] === 2
      || store.virtualBlocs[2][4] === 2
    ) {
      return false;
    }

    store.virtualBlocs[0][5] = 1;
    store.virtualBlocs[1][5] = 1;
    store.virtualBlocs[2][5] = 1;
    store.virtualBlocs[2][4] = 1;

    return true;
  }
}

export function assertGameOver () {
  const isInsertOK = insertBlocs("inverse-l");
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