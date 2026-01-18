import { store, } from "./store.js";
import { getBlocs, } from "./rotation.js";
import { colors, } from "./rendering.js";

export function dispatchUpdateScore (missingRowsNumber) {
    const score = {
        0: 0,
        1: 100,
        2: 300,
        3: 500,
        4: 800,
    };
    const newScore = store.score + score[missingRowsNumber];
    store.score = newScore;
    store.numberOfLinesCleared = store.numberOfLinesCleared + missingRowsNumber;
    store.speed = store.defaultSpeed - (store.numberOfLinesCleared * store.increaseSpeedBy) / 10;
    const level = 1 + Math.floor(store.numberOfLinesCleared / 10);
    
    const event = new CustomEvent("updateScore", { detail: { score: newScore, level, } });
    document.dispatchEvent(event);
}

export function removeFullRow () {
    // backup the active tetromino: 1
    const backupActiveTetromino = getBlocs(); // backup = [[5, 6], [5, 7], [5, 8], [5, 9]];

    // remove the active tetromino so there are only 2 and 3
    const backupVirtualBlocs = JSON.parse(JSON.stringify(store.virtualBlocs));
    const backupVirtualBlocsColor = JSON.parse(JSON.stringify(store.virtualBlocsColor));

    backupActiveTetromino.forEach(([y, x]) => {
        backupVirtualBlocs[y][x] = 0;
        backupVirtualBlocsColor[y][x] = "bloc";
    });

    for (let i = 0; i < backupVirtualBlocs.length; i++) {
        const isRowFull = backupVirtualBlocs[i].every(x => x === 2);
        if (isRowFull) {
            // i replace the row's first column with 5. We'll consider if a row has a column 5, we remove that row
            backupVirtualBlocs[i][0] = 5;
        }
    }

    // we create a new virtualBlocs by copiying row by row the old virtualBlocs and by omitting the rows with first bloc 5
    const newVirtualBlocs = [];
    const newVirtualBlocsColor = [];
    backupVirtualBlocs.forEach((row, y) => {
        if (row[0] === 5) return;
        
        const newRow = [];
        const newRowColor = [];

        row.forEach((column, x) => {
            newRow.push(column);
            newRowColor.push(backupVirtualBlocsColor[y][x]);
        });

        newVirtualBlocs.push(newRow);
        newVirtualBlocsColor.push(newRowColor);
    });

    // get how many rows are missing to fill the height 20
    const missingRowsNumber = 20 - newVirtualBlocs.length;
    dispatchUpdateScore(missingRowsNumber);

    // we fill the new virtualBlocs with rows with 0 columns
    for (let i = 0; i < missingRowsNumber; i++) {
        newVirtualBlocs.unshift(Array.from({ length: 10 }, () => 0));
        newVirtualBlocsColor.unshift(Array.from({ length: 10}, () => "bloc"));
    }

    // finally we restore the active tetromino by using the backup of it
    backupActiveTetromino.forEach(([y, x]) => {
        newVirtualBlocs[y][x] = 1;
        newVirtualBlocsColor[y][x] = colors[store.activeTetromino];
    });

    // then restore change value of store.virtualBlocs and store.virtualBlocsColor
    store.virtualBlocs = newVirtualBlocs;
    store.virtualBlocsColor = newVirtualBlocsColor;
    
}