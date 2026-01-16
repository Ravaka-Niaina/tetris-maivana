import { store, } from "./store.js";
import { 
  assertGameOver,
  interpretRightMove, 
  interpretLeftMove, 
  interpretDownMove,
  interpretUpButton,
} from "./interpretKeys.js";
import { moveBlocs, stopBlocs, } from "./moveBlocs.js";
import { renderBlocsContainer, } from "./rendering.js";
import { spawnRandomTetromino, } from "./spawnTetromino.js";

for (let i = 0; i < 20; i++) {
  const virtualRow = [];
  for (let u = 0; u < 10; u++) {
    virtualRow.push(0);
  }
  store.virtualBlocs.push(virtualRow);
}

function startGame () {
  store.idMovingTimeInterval = setInterval(() => {
    const result = moveBlocs(stopBlocs, store.virtualBlocs);
    
    if (result !== true) {
      if (assertGameOver()) {
        return clearInterval(store.idMovingTimeInterval);
      }
    }

    renderBlocsContainer();
  }, store.speed);
}

function listenForInputKeys () {
  document.addEventListener("keydown", (event) => {
    const possibleMoves = {
      ArrowRight: interpretRightMove,
      ArrowLeft: interpretLeftMove,
      ArrowDown: interpretDownMove,
      ArrowUp: interpretUpButton,
    };
    possibleMoves[event.key]();
    renderBlocsContainer();
  });
}

window.spawnRandomTetromino = spawnRandomTetromino;

spawnRandomTetromino();
renderBlocsContainer();
listenForInputKeys();
startGame();