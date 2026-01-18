export const store = {
    blocsContainer: document.getElementById("blocs-container"),
    // 0 = ordinary bloc, 1 = moving bloc, 2 = non moving bloc, 3 = last possibe move
    virtualBlocs: [],
    virtualBlocsColor: [],
    idMovingTimeInterval: undefined,
    activeTetromino: null,
    tetrominoAngle: null,
    isGameOver: false,
    defaultSpeed: 500,
    speed: 500,
    increaseSpeedBy: 100,
    score: 0,
    numberOfLinesCleared: 0,
};