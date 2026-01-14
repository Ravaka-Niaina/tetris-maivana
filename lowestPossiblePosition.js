import { store } from "./store.js";
import { moveBlocs } from "./moveBlocs.js";

function hasMovingBloc(grid) {
  return grid.some(row => row.some(cell => cell === 1));
}

export function getLowestPossiblePosition () {
  const backupVirtualBlocs = JSON.parse(JSON.stringify(store.virtualBlocs));

  // 🚨 Prevent infinite loop
  if (!hasMovingBloc(backupVirtualBlocs)) {
    return backupVirtualBlocs;
  }

  let result = true;
  while (result === true) {
    result = moveBlocs(getBackupOfLastMove, backupVirtualBlocs);
  }

  return result;
}

export function applyLowestPossiblePosition (backupVirtualBlocs) {
  for (let i = 0; i < backupVirtualBlocs.length; i++) {
    for (let u = 0; u < backupVirtualBlocs[i].length; u++) {
      if (store.virtualBlocs[i][u] === 1) {
        store.virtualBlocs[i][u] = 0;
      }
      if (backupVirtualBlocs[i][u] === 3) {
        store.virtualBlocs[i][u] = 2;
      }
    }
  }
}

function getBackupOfLastMove (backupVirtualBlocs) {
  backupVirtualBlocs.forEach(virtualRow => {
    for (let i = 0; i < virtualRow.length; i++) {
      if (virtualRow[i] === 1) {
        virtualRow[i] = 3;// 3 = last possible move
      }
    }
  });

  return backupVirtualBlocs;
}
