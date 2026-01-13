const blocsContainer = document.getElementById("blocs-container");
let idMovingTimeInterval = undefined;
let isGameOver = false;
const speed = 100;

// 0 = ordinary bloc, 1 = moving bloc, 2 = non moving bloc, 3 = last possibe move
const virtualBlocs = [];

for (let i = 0; i < 20; i++) {
  const virtualRow = [];
  for (let u = 0; u < 10; u++) {
    virtualRow.push(0);
  }
  virtualBlocs.push(virtualRow);
}

function renderBlocsContainer () {
  blocsContainer.innerHTML = "";
  const lowestPossiblePosition = getLowestPossiblePosition();
  virtualBlocs.forEach((virtualRow, indexRow) => {
    virtualRow.forEach((columnBloc, indexColumn) => {
      const bloc = document.createElement("div");
      const blocTypes = {
        0 : "bloc",
        1: "moving-bloc",
        2: "non-moving-bloc",
        3: "lowest-possible-position",
      };
      if (lowestPossiblePosition[indexRow][indexColumn] === 3) {
        columnBloc = 3;
      }
      bloc.classList.add(blocTypes[columnBloc]);
      blocsContainer.appendChild(bloc);
    });
});
}

// fonction mampiditra blocs
function insertBlocs (blocName) {

  if (blocName === "l") {
    if (
      virtualBlocs[0][4] === 2
      || virtualBlocs[1][4] === 2
      || virtualBlocs[2][4] === 2
      || virtualBlocs[2][5] === 2
    ) {
      return false;
    }

    virtualBlocs[0][4] = 1;
    virtualBlocs[1][4] = 1;
    virtualBlocs[2][4] = 1;
    virtualBlocs[2][5] = 1;

    return true;
  } else if (blocName === "inverse-l") {
    if (
      virtualBlocs[0][5] === 2
      || virtualBlocs[1][5] === 2
      || virtualBlocs[2][5] === 2
      || virtualBlocs[2][4] === 2
    ) {
      return false;
    }

    virtualBlocs[0][5] = 1;
    virtualBlocs[1][5] = 1;
    virtualBlocs[2][5] = 1;
    virtualBlocs[2][4] = 1;

    return true;
  }
}

function stopBlocs () {
  virtualBlocs.forEach(virtualRow => {
    for (let i = 0; i < virtualRow.length; i++) {
      if (virtualRow[i] === 1 || virtualRow[i] === 3) {
        virtualRow[i] = 2;
      }
    }
  });

  return false;
}

function getBackupOfLastMove (backupVirtualBlocs) {
  backupVirtualBlocs.forEach(virtualRow => {
    for (let i = 0; i < virtualRow.length; i++) {
      if (virtualRow[i] === 1) {
        virtualRow[i] = 3;// 3 = last possible move
      }
    }
  });
  console.log(backupVirtualBlocs);

  return backupVirtualBlocs;
}

// fonction that moves blocs
// return true if move is allowed 
// return false or a duplicate of virtualBlocs if move is not allowed
function moveBlocs (onMoveNotAllowed, virtualBlocs) {
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

function showGameOver () {
  const gameOverDiv = document.getElementById("game-over");
  gameOverDiv.style.display = "flex";
}

function hasMovingBloc(grid) {
  return grid.some(row => row.some(cell => cell === 1));
}

function getLowestPossiblePosition () {
  const backupVirtualBlocs = JSON.parse(JSON.stringify(virtualBlocs));

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

function applyLowestPossiblePosition (backupVirtualBlocs) {
  for (let i = 0; i < backupVirtualBlocs.length; i++) {
    for (let u = 0; u < backupVirtualBlocs[i].length; u++) {
      if (virtualBlocs[i][u] === 1) {
        virtualBlocs[i][u] = 0;
      }
      if (backupVirtualBlocs[i][u] === 3) {
        virtualBlocs[i][u] = 2;
      }
    }
  }
  // jereo eto
}

function interpretRightMove () {
  let isBlocAtExtremeRight = false;
  let isBlocTouchingNonMovingBloc = false;
  for (let i = 0; i < virtualBlocs.length; i++) {
    if (virtualBlocs[i][virtualBlocs[i].length - 1] === 1) {
      isBlocAtExtremeRight = true;
      break;
    }
    for (let u = 0; u < virtualBlocs[i].length - 1; u++) {
      if (virtualBlocs[i][u] === 1 && virtualBlocs[i][u + 1] === 2) {
        isBlocTouchingNonMovingBloc = true;
      }
    }
  }

  //just move the blocs
  if (!isBlocAtExtremeRight && !isBlocTouchingNonMovingBloc) {
    for (let i = 0; i < virtualBlocs.length; i++) {
      for (let u = virtualBlocs[i].length - 1; u > 0; u--) {
        if (virtualBlocs[i][u - 1] === 1) {
          virtualBlocs[i][u] = 1;
          virtualBlocs[i][u - 1] = 0;
        }
      }
    }
  }
}

function interpretLeftMove () {
  let isBlocAtExtremeLeft = false;
  let isBlocTouchingNonMovingBloc = false;
  for (let i = 0; i < virtualBlocs.length; i++) {
    if (virtualBlocs[i][0] === 1) {
      isBlocAtExtremeLeft = true;
      break;
    }
    for (let u = 0; u < virtualBlocs[i].length - 1; u++) {
      if (virtualBlocs[i][u] === 2 && virtualBlocs[i][u + 1] === 1) {
        isBlocTouchingNonMovingBloc = true;
      }
    }
  }

  if (!isBlocAtExtremeLeft && !isBlocTouchingNonMovingBloc) {
    for (let i = 0; i < virtualBlocs.length; i++) {
      for (let u = 0; u < virtualBlocs[i].length - 1; u++) {
        if (virtualBlocs[i][u + 1] === 1) {
          virtualBlocs[i][u] = 1;
          virtualBlocs[i][u + 1] = 0;
        }
      }
    }
  }
}

function assertGameOver () {
  console.log(virtualBlocs);
  const isInsertOK = insertBlocs("inverse-l");
  console.log("insert ok va = " + isInsertOK);
  if (!isInsertOK) {
    showGameOver();
    clearInterval(idMovingTimeInterval);
    isGameOver = true;
    console.log("game over lesy e");
    return true;
  }

  return false;
}

function startGame () {
  idMovingTimeInterval = setInterval(() => {
    const result = moveBlocs(stopBlocs,virtualBlocs);
    
    if (result !== true) {
      if (assertGameOver()) {
        return clearInterval(idMovingTimeInterval);
      }
    }

    renderBlocsContainer();
  }, speed);
}

function interpretDownMove () {
  if (isGameOver === true) return;
  
  clearInterval(idMovingTimeInterval);
  const lowestPossiblePosition = getLowestPossiblePosition();
  applyLowestPossiblePosition(lowestPossiblePosition);

  // add another blocs
  if (!assertGameOver()) {
    // move the newly added bloc
    idMovingTimeInterval = setInterval(() => {
      const result = moveBlocs(stopBlocs, virtualBlocs);
      if (result !== true) {
        assertGameOver();
      }
      renderBlocsContainer();
    }, speed);
    
  } 
}

function listenForInputKeys () {
  document.addEventListener("keydown", (event) => {
    const possibleMoves = {
      ArrowRight: interpretRightMove,
      ArrowLeft: interpretLeftMove,
      ArrowDown: interpretDownMove,
    };
    possibleMoves[event.key]();
    renderBlocsContainer();
  });
}

insertBlocs("l");
renderBlocsContainer();
listenForInputKeys();
startGame();