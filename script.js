
// MEMORY CARD GAME

console.log("Memory Card Game Started");

// DOM ELEMENTS

// Game board
const gameBoard = document.getElementById("gameBoard");

// Game info
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("time");

// Buttons
const restartButton = document.getElementById("restart");
const pauseButton = document.getElementById("pauseButton");
const startButton = document.getElementById("startButton");
const exitButton = document.getElementById("exitButton");

// Start screen
const startScreen = document.getElementById("startScreen");
// Player input
const playerNameInput = document.getElementById("playerName");

// Leaderboard elements
const bestPlayerDisplay = document.getElementById("bestPlayer");
const bestMovesDisplay = document.getElementById("bestMoves");
const bestTimeDisplay = document.getElementById("bestTime");
const bestDifficultyDisplay = document.getElementById("bestDifficulty");

const nextLevelButton =  document.getElementById("nextLevelButton");

const closeVictoryButton = document.getElementById("closeVictoryButton");

// Score
const scoreDisplay = document.getElementById("score");

// Achievements
const achievementList = document.getElementById("achievementList");


// Background music
const bgMusic = new Audio("assets/sounds/bg-music.mp3");

// Flip sound
const flipSound = new Audio("assets/sounds/flip.mp3");

// Match sound
const matchSound = new Audio("assets/sounds/match.mp3");

// Win sound
const winSound = new Audio("assets/sounds/win.mp3");


const difficultySelect = document.getElementById("difficulty");

// Victory screen
const victoryScreen =
    document.getElementById("victoryScreen");

const finalStats =
    document.getElementById("finalStats");

const playAgainButton =
    document.getElementById("playAgainButton");

// Confetti container
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

// Active game cards
let gameCards = [];

// Store selected cards
let flippedCards = [];

// Prevent spam clicking
let lockBoard = false;

// Pause state
let gamePaused = false;

// Moves counter
let moves = 0;

// Timer
let timer = 0;
let timerInterval;

// Matched cards counter
let matchedCards = 0;

// Current player
let currentPlayer = "";
// Current difficulty
let currentDifficulty = "";

// Score system
let score = 0;

// Combo multiplier
let combo = 1;

// Sound states
let musicMuted = false;

let soundMuted = false;

// Achievements
let achievements = [];


function setDifficulty() {
    const difficulty = difficultySelect.value;
    gameCards = [];
    if(difficulty === "easy"){
        gameCards = [...allCards.slice(0,4),
                     ...allCards.slice(0,4)];

        // Update grid
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


        gameCards = [...allCards.slice(0,12),
                     ...allCards.slice(0,12)];

       
        gameBoard.style.gridTemplateColumns =
            "repeat(6, 100px)";
    }
}


function shuffleCards() {

    gameCards.sort(() => Math.random() - 0.5);

}


function createCards() {

    // Clear old cards
    gameBoard.innerHTML = "";

    // Create new cards
    gameCards.forEach((emoji) => {

        // Create card element
        const card = document.createElement("div");

        // Add class
        card.classList.add("card");

        // Store emoji in dataset
        card.dataset.emoji = emoji;

        // Hide emoji initially
        card.innerHTML = "?";

        // Add click event
        card.addEventListener("click", flipCard);

        // Add card to board
        gameBoard.appendChild(card);

    });
}


function flipCard() {

    // Stop if game paused
    if (gamePaused) return;

    // Stop if board locked
    if (lockBoard) return;

    // Prevent clicking same card twice
    if (this === flippedCards[0]) return;

    // Show emoji
    this.innerHTML = this.dataset.emoji;

    // Add flipped style
    this.classList.add("flipped");

    // Play sound
// Reset sound
if(!soundMuted){

    flipSound.currentTime = 0;

    flipSound.play();
}
    // Store card
    flippedCards.push(this);

    // Check if 2 cards selected
    if (flippedCards.length === 2) {

        // Increase moves
        moves++;

        // Update UI
        movesDisplay.textContent = moves;

        // Check match
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

    // Remove click events
    flippedCards[0].removeEventListener("click", flipCard);

    flippedCards[1].removeEventListener("click", flipCard);

    // Play match sound
if(!soundMuted){

    matchSound.currentTime = 0;

    matchSound.play();
}
   
    matchedCards += 2;

    // Increase score
score += 10 * combo;

// Increase combo
combo++;

// Update score UI
scoreDisplay.textContent = score;
    // Check win
    checkWin();

    // Reset board
    resetBoard();
}


function unflipCards() {

    // Lock board
    lockBoard = true;

    // Delay flip back
    setTimeout(() => {

        // Hide emojis
        flippedCards[0].innerHTML = "?";
        flippedCards[1].innerHTML = "?";

        // Remove flipped class
        flippedCards[0].classList.remove("flipped");
        flippedCards[1].classList.remove("flipped");

        // Reset combo
combo = 1;
        // Reset board
        resetBoard();

    }, 1000);
}



function resetBoard() {

    flippedCards = [];

    lockBoard = false;

}


function startTimer() {

    // Prevent multiple timers
    clearInterval(timerInterval);

    // Start timer
    timerInterval = setInterval(() => {

        timer++;

        timerDisplay.textContent = timer;

    }, 1000);
}



function checkWin() {

    if (matchedCards === gameCards.length) {

        // Stop timer
        clearInterval(timerInterval);

        // Save scores
        saveBestScore();

        // Reload leaderboard
        loadBestScore();

        // Stop background music
        bgMusic.pause();

        // Play win sound
        winSound.currentTime = 0;

        winSound.play();

        // Create confetti
        createConfetti();

        // Show stats
        finalStats.innerHTML =
            `
            👤 ${currentPlayer}<br>
            🎯 Moves: ${moves}<br>
            ⏱️ Time: ${timer} sec
            `;

            // Speed achievement
if(timer <= 30){

    unlockAchievement(
        "⚡ Speed Master"
    );
}

// Low move achievement
if(moves <= 20){

    unlockAchievement(
        "🧠 Perfect Memory"
    );
}

// Hard mode achievement
if(currentDifficulty === "hard"){

    unlockAchievement(
        "🔥 Hard Mode Champion"
    );
}

        // Show victory screen
        victoryScreen.classList.remove("hidden");
    }
}


function saveBestScore() {

    // Unique keys per difficulty
    const movesKey =
        `bestMoves_${currentDifficulty}`;

    const playerKey =
        `bestPlayer_${currentDifficulty}`;

    const timeKey =
        `bestTime_${currentDifficulty}`;

    // Existing best score
    const bestMoves =
        localStorage.getItem(movesKey);

    // Save only if better
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

    // Current selected difficulty
    const difficulty =
        difficultySelect.value;

    // Dynamic keys
    const movesKey =
        `bestMoves_${difficulty}`;

    const playerKey =
        `bestPlayer_${difficulty}`;

    const timeKey =
        `bestTime_${difficulty}`;

    // Load data
    const bestMoves =
        localStorage.getItem(movesKey);

    const bestPlayer =
        localStorage.getItem(playerKey);

    const bestTime =
        localStorage.getItem(timeKey);

    // Update UI
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

    // Create many particles
    for(let i = 0; i < 100; i++){

        // Create confetti element
        const confetti =
            document.createElement("div");

        // Add class
        confetti.classList.add("confetti");

        // Random horizontal position
        confetti.style.left =
            Math.random() * 100 + "%";

        // Random color
        confetti.style.backgroundColor =
            `hsl(${Math.random() * 360},
                 100%,
                 50%)`;

        // Random animation duration
        confetti.style.animationDuration =
            Math.random() * 3 + 2 + "s";

        // Add to container
        confettiContainer.appendChild(confetti);

        // Remove later
        setTimeout(() => {

            confetti.remove();

        }, 5000);
    }
}


function unlockAchievement(name) {

    // Prevent duplicates
    if(achievements.includes(name)) return;

    // Store achievement
    achievements.push(name);

    // Create UI element
    const achievement =
        document.createElement("li");

    achievement.textContent =
        `🏆 ${name}`;

    // Add to UI
    achievementList.appendChild(
        achievement
    );
}



function resetGameState(){

    // Stop timer
    clearInterval(timerInterval);

    // Reset variables
    moves = 0;

    timer = 0;

    matchedCards = 0;

    score = 0;

    combo = 1;

    lockBoard = false;

    gamePaused = false;

    flippedCards = [];

    // Clear achievements
    achievements = [];

    achievementList.innerHTML = "";

    // Reset UI
    movesDisplay.textContent = 0;

    timerDisplay.textContent = 0;

    scoreDisplay.textContent = 0;

    // Hide victory screen
    victoryScreen.classList.add(
        "hidden"
    );

    // Clear board
    gameBoard.innerHTML = "";
}


function startGame() {

 resetGameState();
    // Get player name
currentPlayer = playerNameInput.value.trim();
// Store selected difficulty
currentDifficulty =
    difficultySelect.value;

// Prevent empty name
if(currentPlayer === ""){

    alert("⚠ Please enter your name!");

    return;
}
    startScreen.style.display = "none";

       // Play background music
bgMusic.play();

    // Set difficulty cards
    setDifficulty();

    // Shuffle cards
    shuffleCards();

    // Create cards
    createCards();

    // Start timer
    startTimer();

    
}



function restartGame(){

    // Reset everything
    resetGameState();

    // Set difficulty again
    setDifficulty();

    // Shuffle cards
    shuffleCards();

    // Create cards
    createCards();

    // Restart timer
    startTimer();

    // Restart music
    bgMusic.currentTime = 0;

    if(!musicMuted){

        bgMusic.play();
    }
}


function exitGame(){

    // Stop timer
    clearInterval(timerInterval);

    // Stop music
    bgMusic.pause();

    bgMusic.currentTime = 0;

    // Reset variables
    gamePaused = false;

    moves = 0;

    timer = 0;

    matchedCards = 0;

    score = 0;

    combo = 1;

    flippedCards = [];

    // Reset displays
    movesDisplay.textContent = 0;

    timerDisplay.textContent = 0;

    scoreDisplay.textContent = 0;

    // Clear cards
    gameBoard.innerHTML = "";

    // Hide victory screen
    victoryScreen.classList.add(
        "hidden"
    );

    // SHOW START SCREEN
    startScreen.classList.remove(
        "hidden"
    );

    // Make sure it displays correctly
    startScreen.style.display = "flex";
}


function togglePause() {

    // Toggle state
    gamePaused = !gamePaused;

    if (gamePaused) {

    clearInterval(timerInterval);

    // Pause music
    bgMusic.pause();

    pauseButton.textContent = "Resume";

} else {

    startTimer();

    // Resume music
    bgMusic.play();

    pauseButton.textContent = "Pause";
}
}


function nextLevel(){

    // Easy -> Medium
    if(currentDifficulty === "easy"){

        difficultySelect.value = "medium";
    }

    // Medium -> Hard
    else if(currentDifficulty === "medium"){

        difficultySelect.value = "hard";
    }

    // Hard completed
    else{

        alert("🏆 All levels completed!");

        return;
    }

    // Update current difficulty
    currentDifficulty =
        difficultySelect.value;

    // Restart game
    restartGame();
}



function closeVictoryScreen(){

    victoryScreen.classList.add(
        "hidden"
    );
}

// EVENT LISTENERS

// Start game
startButton.addEventListener("click", startGame);

// Restart game
restartButton.addEventListener("click", restartGame);

// Pause game
pauseButton.addEventListener("click", togglePause);
// Load saved leaderboard
loadBestScore();
// Play again button
// Play again
playAgainButton.addEventListener(
    "click",
    () => {

        restartGame();
    }
);
// Update leaderboard
difficultySelect.addEventListener(
    "change",
    loadBestScore
);
// Next level
nextLevelButton.addEventListener(
    "click",
    nextLevel
);


// Close victory screen
closeVictoryButton.addEventListener(
    "click",
    closeVictoryScreen
);
// Exit game
exitButton.addEventListener(
    "click",
    exitGame
);