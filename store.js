export const store = {
    blocsContainer: document.getElementById("blocs-container"),
    // 0 = ordinary bloc, 1 = moving bloc, 2 = non moving bloc, 3 = last possibe move
    virtualBlocs: [],
    idMovingTimeInterval: undefined,
    activeTetromino: null,
    tetrominoAngle: null,
    isGameOver: false,
    speed: 500
};