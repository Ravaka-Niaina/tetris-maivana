import { store } from "./store.js"; 

const tetrominos = [
    "stick", 
    "square",
    "capitalT",
    "rightSnake",
    "leftSnake",
    "capitalJ", 
    "capitalL"
];
let splicedTetrominos = [];

export function spawnRandomTetromino () {
    const randomTetrominoName = getRandomTetrominoName();
    const isInsertOK = insertTetromino(randomTetrominoName);
    if (isInsertOK) store.tetrominoAngle = 0;

    return isInsertOK;
}

function getRandomTetrominoName () {
    splicedTetrominos.length === 0 && fillsplicedTetrominos();
    const indexToPop = getRandomInteger(0, splicedTetrominos.length - 1);
    const tetrominoToReturn = splicedTetrominos.splice(indexToPop, 1)[0];
    return tetrominoToReturn;
}

function fillsplicedTetrominos () {
    splicedTetrominos = JSON.parse(JSON.stringify(tetrominos));
}

// min and max both included
function getRandomInteger (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// fonction mampiditra blocs
export function insertTetromino (blocName) {
    const insertFunctions = {
        stick: insertStick,
        square: insertSquare,
        capitalT: insertCapitalT,
        rightSnake: insertRightSnake,
        leftSnake: insertLeftSnake,
        capitalJ: insertCapitalJ,
        capitalL: insertCapitalL, 
    };
    const isInsertOK = insertFunctions[blocName]();
    return isInsertOK;
}

function insertStick () {
    const positions = [[0, 3], [0, 4], [0, 5], [0, 6]];
    return verifyAndInsert(positions, "stick");
}

function insertSquare () {
    const positions = [[0, 4], [0, 5], [1, 4], [1, 5]];
    return verifyAndInsert(positions, "square");
}

function insertCapitalT () {
    const positions = [[0, 4], [1, 3], [1, 4], [1, 5]];
    return verifyAndInsert(positions, "capitalT");
}

function insertRightSnake () {
    const positions = [[0, 5], [0, 4], [1, 4], [1, 3]];
    return verifyAndInsert(positions, "rightSnake");
}

function insertLeftSnake () {
    const positions = [[0, 3], [0, 4], [1, 4], [1, 5]];
    return verifyAndInsert(positions, "leftSnake");
}

function insertCapitalJ () {
    const positions = [[0, 3], [1, 3], [1, 4], [1, 5]];
    return verifyAndInsert(positions, "capitalJ");
}

function insertCapitalL () {
    const positions = [[0, 5], [1, 3], [1, 4], [1, 5]];
    return verifyAndInsert(positions, "capitalL");
}

// return boolean isInsertOK
function verifyAndInsert (positions, activeTetromino) {
    if (positions.some(position  => store.virtualBlocs[position[0]][position[1]] === 2)) {
        store.activeTetromino = null;
        return false;
    } 

    positions.forEach(positions => store.virtualBlocs[positions[0]][positions[1]] = 1);
    store.activeTetromino = activeTetromino;
    return true;
}