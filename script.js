
 

console.log("Memory Card Game Started");

 

 
const gameBoard = document.getElementById("gameBoard");

 
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("time");

 
const restartButton = document.getElementById("restart");
const pauseButton = document.getElementById("pauseButton");
const startButton = document.getElementById("startButton");
const exitButton = document.getElementById("exitButton");

 
const startScreen = document.getElementById("startScreen");
 
const playerNameInput = document.getElementById("playerName");

 
const bestPlayerDisplay = document.getElementById("bestPlayer");
const bestMovesDisplay = document.getElementById("bestMoves");
const bestTimeDisplay = document.getElementById("bestTime");
const bestDifficultyDisplay = document.getElementById("bestDifficulty");

const nextLevelButton =  document.getElementById("nextLevelButton");

const closeVictoryButton = document.getElementById("closeVictoryButton");

 
const scoreDisplay = document.getElementById("score");

 
const achievementList = document.getElementById("achievementList");


 
const bgMusic = new Audio("assets/sounds/bg-music.mp3");

 
const flipSound = new Audio("assets/sounds/flip.mp3");

 
const matchSound = new Audio("assets/sounds/match.mp3");

 
const winSound = new Audio("assets/sounds/win.mp3");


const difficultySelect = document.getElementById("difficulty");

 
const victoryScreen =
    document.getElementById("victoryScreen");

const finalStats =
    document.getElementById("finalStats");

const playAgainButton =
    document.getElementById("playAgainButton");

 
const confettiContainer =
    document.getElementById("confettiContainer");

const allCards = [

    "🐶",
    "🐱",
    "🐸",
    "🐵",
    "🦁",
    "🐼",
    "🐰",
    "🐯",

    "🐨",
    "🦊",
    "🐻",
    "🐮",

    "🐷",
    "🐔",
    "🐙",
    "🦄"
];

 
let gameCards = [];

 
let flippedCards = [];

 
let lockBoard = false;

 
let gamePaused = false;

 
let moves = 0;

 
let timer = 0;
let timerInterval;

 
let matchedCards = 0;

 
let currentPlayer = "";
 
let currentDifficulty = "";

 
let score = 0;

 
let combo = 1;

 
let musicMuted = false;

let soundMuted = false;

 
let achievements = [];


function setDifficulty() {
    const difficulty = difficultySelect.value;
    gameCards = [];
    if(difficulty === "easy"){
        gameCards = [...allCards.slice(0,4),
                     ...allCards.slice(0,4)];

 
        gameBoard.style.gridTemplateColumns =
            "repeat(4, 100px)";
    }


    else if(difficulty === "medium"){

        gameCards = [...allCards.slice(0,8),
                     ...allCards.slice(0,8)];

      
        gameBoard.style.gridTemplateColumns =
            "repeat(4, 100px)";
    }

    else{


        gameCards = [...allCards.slice(0,10),
                     ...allCards.slice(0,10)];

       
        gameBoard.style.gridTemplateColumns =
            "repeat(5,80px)";
    }
}


function shuffleCards() {

    gameCards.sort(() => Math.random() - 0.5);

}


function createCards() {

 
    gameBoard.innerHTML = "";

 
    gameCards.forEach((emoji) => {

 
        const card = document.createElement("div");

 
        card.classList.add("card");

 
        card.dataset.emoji = emoji;

 
        card.innerHTML = "?";

 
        card.addEventListener("click", flipCard);

 
        gameBoard.appendChild(card);

    });
}


function flipCard() {

 
    if (gamePaused) return;

 
    if (lockBoard) return;

 
    if (this === flippedCards[0]) return;

 
    this.innerHTML = this.dataset.emoji;

 
    this.classList.add("flipped");

 
 
if(!soundMuted){

    flipSound.currentTime = 0;

    flipSound.play();
}
 
    flippedCards.push(this);

 
    if (flippedCards.length === 2) {

 
        moves++;

 
        movesDisplay.textContent = moves;

 
        checkMatch();
    }
}



function checkMatch() {

    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

 
    if (card1.dataset.emoji === card2.dataset.emoji) {

        disableCards();

    } else {

        unflipCards();

    }
}



function disableCards() {

 
    flippedCards[0].removeEventListener("click", flipCard);

    flippedCards[1].removeEventListener("click", flipCard);

 
if(!soundMuted){

    matchSound.currentTime = 0;

    matchSound.play();
}
   
    matchedCards += 2;

 
score += 10 * combo;

 
combo++;

 
scoreDisplay.textContent = score;
 
    checkWin();

 
    resetBoard();
}


function unflipCards() {

 
    lockBoard = true;

 
    setTimeout(() => {

 
        flippedCards[0].innerHTML = "?";
        flippedCards[1].innerHTML = "?";

 
        flippedCards[0].classList.remove("flipped");
        flippedCards[1].classList.remove("flipped");

 
combo = 1;
 
        resetBoard();

    }, 1000);
}



function resetBoard() {

    flippedCards = [];

    lockBoard = false;

}


function startTimer() {

 
    clearInterval(timerInterval);

 
    timerInterval = setInterval(() => {

        timer++;

        timerDisplay.textContent = timer;

    }, 1000);
}



function checkWin() {

    if (matchedCards === gameCards.length) {

 
        clearInterval(timerInterval);

 
        saveBestScore();

 
        loadBestScore();

 
        bgMusic.pause();

 
        winSound.currentTime = 0;

        winSound.play();

 
        createConfetti();

 
        finalStats.innerHTML =
            `
            👤 ${currentPlayer}<br>
            🎯 Moves: ${moves}<br>
            ⏱️ Time: ${timer} sec
            `;

 
if(timer <= 30){

    unlockAchievement(
        "⚡ Speed Master"
    );
}

 
if(moves <= 20){

    unlockAchievement(
        "🧠 Perfect Memory"
    );
}

 
if(currentDifficulty === "hard"){

    unlockAchievement(
        "🔥 Hard Mode Champion"
    );
}

 
        victoryScreen.classList.remove("hidden");
    }
}


function saveBestScore() {

 
    const movesKey =
        `bestMoves_${currentDifficulty}`;

    const playerKey =
        `bestPlayer_${currentDifficulty}`;

    const timeKey =
        `bestTime_${currentDifficulty}`;

 
    const bestMoves =
        localStorage.getItem(movesKey);

 
    if(bestMoves === null || moves < bestMoves){

        localStorage.setItem(
            movesKey,
            moves
        );

        localStorage.setItem(
            playerKey,
            currentPlayer
        );

        localStorage.setItem(
            timeKey,
            timer
        );
    }
}


function loadBestScore() {

 
    const difficulty =
        difficultySelect.value;

 
    const movesKey =
        `bestMoves_${difficulty}`;

    const playerKey =
        `bestPlayer_${difficulty}`;

    const timeKey =
        `bestTime_${difficulty}`;

 
    const bestMoves =
        localStorage.getItem(movesKey);

    const bestPlayer =
        localStorage.getItem(playerKey);

    const bestTime =
        localStorage.getItem(timeKey);

 
    if(bestPlayer){

        bestPlayerDisplay.textContent =
            bestPlayer;

        bestMovesDisplay.textContent =
            bestMoves;

        bestTimeDisplay.textContent =
            bestTime;

        bestDifficultyDisplay.textContent =
            difficulty;

    } else {

        bestPlayerDisplay.textContent = "---";

        bestMovesDisplay.textContent = "0";

        bestTimeDisplay.textContent = "0";

        bestDifficultyDisplay.textContent =
            difficulty;
    }
}


function createConfetti() {

 
    for(let i = 0; i < 100; i++){

 
        const confetti =
            document.createElement("div");

 
        confetti.classList.add("confetti");

 
        confetti.style.left =
            Math.random() * 100 + "%";

 
        confetti.style.backgroundColor =
            `hsl(${Math.random() * 360},
                 100%,
                 50%)`;

 
        confetti.style.animationDuration =
            Math.random() * 3 + 2 + "s";

 
        confettiContainer.appendChild(confetti);

 
        setTimeout(() => {

            confetti.remove();

        }, 5000);
    }
}


function unlockAchievement(name) {

 
    if(achievements.includes(name)) return;

 
    achievements.push(name);

 
    const achievement =
        document.createElement("li");

    achievement.textContent =
        `🏆 ${name}`;

 
    achievementList.appendChild(
        achievement
    );
}



function resetGameState(){

 
    clearInterval(timerInterval);

 
    moves = 0;

    timer = 0;

    matchedCards = 0;

    score = 0;

    combo = 1;

    lockBoard = false;

    gamePaused = false;

    flippedCards = [];

 
    achievements = [];

    achievementList.innerHTML = "";

 
    movesDisplay.textContent = 0;

    timerDisplay.textContent = 0;

    scoreDisplay.textContent = 0;

 
    victoryScreen.classList.add(
        "hidden"
    );

 
    gameBoard.innerHTML = "";
}


function startGame() {

 resetGameState();
 
currentPlayer = playerNameInput.value.trim();
 
currentDifficulty =
    difficultySelect.value;

 
if(currentPlayer === ""){

    alert("⚠ Please enter your name!");

    return;
}
    startScreen.style.display = "none";

 
bgMusic.play();

 
    setDifficulty();

 
    shuffleCards();

 
    createCards();

 
    startTimer();

    
}



function restartGame(){

 
    resetGameState();

 
    setDifficulty();

 
    shuffleCards();

 
    createCards();

 
    startTimer();

 
    bgMusic.currentTime = 0;

    if(!musicMuted){

        bgMusic.play();
    }
}


function exitGame(){

 
    clearInterval(timerInterval);

 
    bgMusic.pause();

    bgMusic.currentTime = 0;

 
    gamePaused = false;

    moves = 0;

    timer = 0;

    matchedCards = 0;

    score = 0;

    combo = 1;

    flippedCards = [];

 
    movesDisplay.textContent = 0;

    timerDisplay.textContent = 0;

    scoreDisplay.textContent = 0;

 
    gameBoard.innerHTML = "";

 
    victoryScreen.classList.add(
        "hidden"
    );

 
    startScreen.classList.remove(
        "hidden"
    );

 
    startScreen.style.display = "flex";
}


function togglePause() {

 
    gamePaused = !gamePaused;

    if (gamePaused) {

    clearInterval(timerInterval);

 
    bgMusic.pause();

    pauseButton.textContent = "Resume";

} else {

    startTimer();

 
    bgMusic.play();

    pauseButton.textContent = "Pause";
}
}


function nextLevel(){

 
    if(currentDifficulty === "easy"){

        difficultySelect.value = "medium";
    }

 
    else if(currentDifficulty === "medium"){

        difficultySelect.value = "hard";
    }

 
    else{

        alert("🏆 All levels completed!");

        return;
    }

 
    currentDifficulty =
        difficultySelect.value;

 
    restartGame();
}



function closeVictoryScreen(){

    victoryScreen.classList.add(
        "hidden"
    );
}

 

 
startButton.addEventListener("click", startGame);

 
restartButton.addEventListener("click", restartGame);

 
pauseButton.addEventListener("click", togglePause);
 
loadBestScore();
 
 
playAgainButton.addEventListener(
    "click",
    () => {

        restartGame();
    }
);
 
difficultySelect.addEventListener(
    "change",
    loadBestScore
);
 
nextLevelButton.addEventListener(
    "click",
    nextLevel
);


 
closeVictoryButton.addEventListener(
    "click",
    closeVictoryScreen
);
 
exitButton.addEventListener(
    "click",
    exitGame
);