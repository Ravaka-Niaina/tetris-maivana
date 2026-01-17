
import { store, } from "./store.js";
import { getLowestPossiblePosition, } from "./lowestPossiblePosition.js";

export const colors = {
  stick: "cyan",
  square: "yellow",
  capitalT: "purple",
  rightSnake: "green",
  leftSnake: "red",
  capitalJ: "blue",
  capitalL: "orange",
};

export function renderBlocsContainer () {
  store.blocsContainer.innerHTML = "";
  const lowestPossiblePosition = getLowestPossiblePosition();
  store.virtualBlocs.forEach((virtualRow, indexRow) => {
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
      bloc.classList.add(store.virtualBlocsColor[indexRow][indexColumn]);
      
      if (columnBloc === 1) {
        bloc.classList.add(colors[store.activeTetromino]);
      }

      store.blocsContainer.appendChild(bloc);
    });
  });
}

document.addEventListener("saveColor", (event) => {
  const { detail: { tetrominoName, concernedBlocs } } = event;
  concernedBlocs.forEach(([y, x]) => {
    store.virtualBlocsColor[y][x] = colors[tetrominoName];
  });
  renderBlocsContainer();
});

document.addEventListener("updateScore", (event) => {
  const { detail: { score, } } = event;
  const spanScore = document.getElementById("score");
  spanScore.innerHTML = score;
});