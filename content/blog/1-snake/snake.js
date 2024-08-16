"use strict";

/**
 * Object with immutable attributes of the snake game
 */
const CONSTANTS = {
    width: 8, //game-board width
    height: 8, //game-board height
    cellSize: 20, //size of a cell in pixels
    updateTime: 250, //update interval in miliseconds
    appleScore: 50, //the score bonus for getting an apple
    snakeColor: 'green',
    headColor: '#0A0',
    appleColor: 'red'
};
Object.freeze(CONSTANTS);

document.addEventListener('DOMContentLoaded', () => {

    //The main snake object
    let snake = {
        //in the middle of the grid (grid-index) and facing right
        bodyParts: [
            CONSTANTS.height/2 * CONSTANTS.width + CONSTANTS.width/2,
            CONSTANTS.height/2 * CONSTANTS.width + CONSTANTS.width/2 - 1
        ],
        orientation: [1, 0], //[deltaX, deltaY]
    };
    //apple cell-index
    let appleIndex = 0;
    
    //Gamestate variables
    let isGameOver = true;
    let isPaused = false;
    let score = 0;
    let updateTimer; //update-function timer
    
    // HTML-element references //

    //Initialising the grid
    const snakeGrid = document.getElementById("snakegrid");
    snakeGrid.style.width = `${CONSTANTS.width * CONSTANTS.cellSize}px`;
    snakeGrid.style.height = `${CONSTANTS.height * CONSTANTS.cellSize}px`;
    //Initialising grid-cells
    for (let index = 0; index < CONSTANTS.width * CONSTANTS.height; index++) {
        const gridCell = document.createElement('div');
        snakeGrid.appendChild(gridCell);
    }
    const gridCells = Array.from(document.querySelectorAll('#snakegrid div'));

    //Initialising the score counter
    const scoreCounter = document.getElementById("score-counter");
    scoreCounter.textContent = score.toString();

    //Initialising all buttons
    const playButton = document.getElementById("play-button");
    playButton.addEventListener("click", () => {
        if (isGameOver) {
            isGameOver = false;
            reset();
        } else if (isPaused) {
            resume();
        } else {
            pause();
        }
    });
    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", () => { reset(); });

    //Defining and enabling the control handler
    document.addEventListener("keydown", (event) => {

        switch (event.code) {
        //Movement
        case "ArrowLeft":
            if (snake.bodyParts[0] - 1 !== snake.bodyParts[1]) {
                snake.orientation[0] = -1;
                snake.orientation[1] = 0;
            }
            break;
        case "ArrowUp":
            if (snake.bodyParts[0] - CONSTANTS.width !== snake.bodyParts[1]) {
                snake.orientation[0] = 0;
                snake.orientation[1] = -1;
            }
            break;
        case "ArrowRight":
            if (snake.bodyParts[0] + 1 !== snake.bodyParts[1]) {
                snake.orientation[0] = 1;
                snake.orientation[1] = 0;
            }
            break;
        case "ArrowDown":
            if (snake.bodyParts[0] + CONSTANTS.width !== snake.bodyParts[1]) {
                snake.orientation[0] = 0;
                snake.orientation[1] = 1;
            }
            break;
        case "KeyP":
            if (isGameOver)
                reset();
            else if (isPaused)
                resume();
            else
                pause();
            break;
        case "KeyR":
            reset();
            break;
        }
    });

    //prevent default scrolling behaviour for the arrow-keys
    window.addEventListener("keydown", function(e) {
        if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    //Finally, Initialise the game
    reset();

    // Game functions //

    function drawSnake(gridIndex) {
        gridCells[gridIndex].className = "snake";
        gridCells[gridIndex].style.backgroundColor = CONSTANTS.headColor;
    }

    function drawApple(gridIndex) {
        gridCells[gridIndex].className = "apple";
        gridCells[gridIndex].style.backgroundColor = CONSTANTS.appleColor;
    }

    function undraw(gridIndex) {
        gridCells[gridIndex].className = "";
        gridCells[gridIndex].style.backgroundColor = "";
    }

    function moveSnake() {
        const oldHead = snake.bodyParts[0];
        const newHead = oldHead + snake.orientation[1] * CONSTANTS.width + snake.orientation[0];

        if (newHead < 0 || newHead >= gridCells.length || //vertical out-of-bounds
            gridCells[newHead].className === "snake" || //snake hit itself
            //horizontal out-of-bounds
            (oldHead % CONSTANTS.width === CONSTANTS.width - 1 && snake.orientation[0] === 1) ||
            (oldHead % CONSTANTS.width === 0 && snake.orientation[0] === -1)
           ) {
            gameOver(false)
            return;
        }
        snake.bodyParts.unshift(newHead);
        gridCells[oldHead].style.backgroundColor = CONSTANTS.snakeColor;
        drawSnake(newHead);

        if (newHead === appleIndex)
            eatApple(); //snake grows
        else {//snake doesn't grow, so tail follows snake
            const prevTailEnd = snake.bodyParts.pop();
            undraw(prevTailEnd);
        }
    }

    function update() {
        moveSnake();
        score--;
        scoreCounter.textContent = score.toString();
    }

    function eatApple() {
        score += CONSTANTS.appleScore;
        scoreCounter.textContent = score.toString();
        if (findNewApplePos() === false) {
            gameOver(true);
        }
    }

    function findNewApplePos() {
        let randomPos = Math.floor(Math.random() * gridCells.length);
        //Iterate through all cells until a available cell is found
        for (let i = 0; i < gridCells.length; i++) {
            const newIndex = (randomPos + i) % gridCells.length;
            if (gridCells[newIndex].className != "snake") {
                appleIndex = newIndex;
                drawApple(appleIndex);
                return true;
            }
        }
        //No new apple location is available
        return false;
    }

    function gameOver(gameWon) {
        if (gameWon) {
            alert("You Won! Hurray!!! :D\nYour final score is: " + score);
        } else {
            alert("Dead snake 💀\nYour final score is: " + score);
        }
        isGameOver = true;
        pause();
    }

    //Button functions
    function resume() {
        isPaused = false;
        updateTimer = setInterval(update, CONSTANTS.updateTime);
    }
    
    function pause() {
        isPaused = true;
        clearInterval(updateTimer);
    }
    
    function reset() {
        //remove the previous snake and apple
        for (let i = 0; i < snake.bodyParts.length; i++) {
            undraw(snake.bodyParts[i]);
        }
        undraw(appleIndex);

        //Reset their positions to a starting state
        snake.bodyParts = [
            CONSTANTS.height/2 * CONSTANTS.width + CONSTANTS.width/2,
            CONSTANTS.height/2 * CONSTANTS.width + CONSTANTS.width/2 - 1
        ];
        snake.orientation = [1, 0];
        drawSnake(snake.bodyParts[0]);
        drawSnake(snake.bodyParts[1]);
        gridCells[snake.bodyParts[1]].style.backgroundColor = 'green';
        findNewApplePos();

        //reset score
        score = 0;
        scoreCounter.textContent = score.toString();

        //Also pause the game
        isGameOver = false;
        pause();
    }
});
