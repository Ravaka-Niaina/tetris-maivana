import { store } from "./store.js"; 

const tetrimonies = [
    "stick", 
    "square", 
    "capitalT", 
    "rightSnake", 
    "leftSnake", 
    "capitalJ", 
    "capitalL"
];
let splicedTetrominoes = [];

export function spawnRandomTetromino () {
    const randomTetrominoName = getRandomTetrominoName();
    const isInsertOK = insertTetromino(randomTetrominoName);

    return isInsertOK;
}

function getRandomTetrominoName () {
    splicedTetrominoes.length === 0 && fillsplicedTetrominoes();
    const indexToPop = getRandomInteger(0, splicedTetrominoes.length - 1);
    const tetrominoToReturn = splicedTetrominoes.splice(indexToPop, 1)[0];
    // console.log(splicedTetrominoes, tetrominoToReturn);
    return tetrominoToReturn;
}

function fillsplicedTetrominoes () {
    splicedTetrominoes = JSON.parse(JSON.stringify(tetrimonies));
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
    return verifyAndInsert(positions);
}

function insertSquare () {
    const positions = [[0, 4], [0, 5], [1, 4], [1, 5]];
    return verifyAndInsert(positions);
}

function insertCapitalT () {
    const positions = [[0, 4], [1, 3], [1, 4], [1, 5]];
    return verifyAndInsert(positions);
}

function insertRightSnake () {
    const positions = [[0, 5], [0, 4], [1, 4], [1, 3]];
    return verifyAndInsert(positions);
}

function insertLeftSnake () {
    const positions = [[0, 3], [0, 4], [1, 4], [1, 5]];
    return verifyAndInsert(positions);
}

function insertCapitalJ () {
    const positions = [[0, 3], [1, 3], [1, 4], [1, 5]];
    return verifyAndInsert(positions);
}

function insertCapitalL () {
    const positions = [[0, 5], [1, 3], [1, 4], [1, 5]];
    return verifyAndInsert(positions);
}

// return boolean isInsertOK
function verifyAndInsert (positions) {
    if (positions.some(position  => store.virtualBlocs[position[0]][position[1]] === 2)) return false;

    positions.forEach(positions => store.virtualBlocs[positions[0]][positions[1]] = 1);

    return true;
}