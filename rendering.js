
import { store, } from "./store.js";
import { getLowestPossiblePosition, } from "./lowestPossiblePosition.js";

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
      store.blocsContainer.appendChild(bloc);
    });
  });
}