// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = []; //[2, 9, 1, 3, 6, 8, 5, 4,10,7];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var mistakes = 0;

function startGame() {
  //initialize game variables
  progress = 0;
  mistakes = 0;
  pattern = [];
  createPattern();

  for (let i = 0; i <= 10; i++) {
    //prints out every value of the pattern array to the console
    console.log("length of patternarray" + pattern[i]);
  }

  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}
// swap the Start and Stop buttons

function stopGame() {
  //end the current game
  gamePlaying = false;
  guessCounter = 0;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function createPattern() {
  //creates a random pattern every time the game restarts
  var length = 0;
  while (length < 11) {
    pattern.push(Math.floor(Math.random() * (10 - 1 + 1) + 1));
    length++;
  }
  length = 0;
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  var guessCounter = 0;
  if (clueHoldTime > 450) {
    clueHoldTime = clueHoldTime - 90; //decreases the amount of time a note plays for
  }
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}
function winGame() {
  stopGame();
  alert("You Won! Congratulations.");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  console.log("guess counter: " + guessCounter);
  console.log("progress: " + progress);
  console.log("place in pattern array: " + pattern[guessCounter]);
  if (!gamePlaying) {
    return;
  }
  if (btn == pattern[guessCounter]) {
    //checks if the button is the correct one

    if (progress == guessCounter) {
      //checks how many times the user has guessed a square

      if (progress == pattern.length - 1) {
        // checks if we've hit the end of pattern array
        winGame();
      } else {
        //if we haven't hit end of array play next clue
        progress++;
        guessCounter = 0;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else if (mistakes < 3) {
    //checks how many mistakes user has made
    mistakes++;
    if (mistakes == 3) {
      loseGame();
    } else {
      //if mistakes are less than 3 it alerts user how many mistakes they've made
      if (mistakes == 1) {
        alert("Incorrect Move! You have made " + mistakes + " mistake.");
      } else {
        alert("Incorrect Move! You have made " + mistakes + " mistakes.");
      }
    }
  } else {
    loseGame();
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 175,
  6: 650.4,
  7: 200,
  8: 800,
  9: 225,
  10: 523.6,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
