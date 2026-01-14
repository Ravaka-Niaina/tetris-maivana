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

export function stopBlocs () {
  store.virtualBlocs.forEach(virtualRow => {
    for (let i = 0; i < virtualRow.length; i++) {
      if (virtualRow[i] === 1 || virtualRow[i] === 3) {
        virtualRow[i] = 2;
      }
    }
  });

  return false;
}