import { store, } from "./store.js";

// function that moves blocs
// return true if move is allowed 
// return false or a duplicate of virtualBlocs if move is not allowed
export function moveBlocs (onMoveNotAllowed, virtualBlocs) {
  for (let i = 0; i < virtualBlocs.length - 1; i++) {
    for (let u = 0; u < virtualBlocs[i].length; u++) {
      if (virtualBlocs[i][u] === 1 && virtualBlocs[i + 1][u] === 2) {
        return onMoveNotAllowed(virtualBlocs);
      }
    }
  }

  for (let i = 0; i < virtualBlocs[virtualBlocs.length - 1].length; i++) {
    if (virtualBlocs[virtualBlocs.length - 1][i] === 1) {
      return onMoveNotAllowed(virtualBlocs);
    }
  }

  for (let i = virtualBlocs.length - 1; i > 0; i--) {
    for (let u = 0; u < virtualBlocs[i].length; u++) {
      if (virtualBlocs[i - 1][u] === 1) {
        virtualBlocs[i][u] = 1;
        virtualBlocs[i - 1][u] = 0;
      }
    }
  }
   
  return true;
}

export function dispatchSaveColor (concernedBlocs) {
  const saveColor = {
    tetrominoName: store.activeTetromino,
    concernedBlocs,
  };

  const saveColorsEvent = new CustomEvent("saveColor", { detail: saveColor});
  document.dispatchEvent(saveColorsEvent)
}

export function stopBlocs () {
  const concernedBlocs = [];
  
  store.virtualBlocs.forEach((virtualRow, indexRow) => {
    for (let i = 0; i < virtualRow.length; i++) {
      if (virtualRow[i] === 1 || virtualRow[i] === 3) {
        virtualRow[i] = 2;
        concernedBlocs.push([indexRow, i]);
      }
    }
  });

  dispatchSaveColor(concernedBlocs);

  return false;
}