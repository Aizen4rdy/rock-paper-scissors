const score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

const clickSound = new Audio('sounds/click.mp3');
const winSound = new Audio('sounds/win.mp3');
const loseSound = new Audio('sounds/lose.mp3');
const tieSound = new Audio('sounds/tie.mp3');
const resetSound = new Audio('sounds/reset.mp3');

let bestOf = 3;
let currentWins = 0;
let currentLosses = 0;
let currentTies = 0;
let gameOver = false;

const themeToggle = document.getElementById('theme-toggle');
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  themeToggle.checked = true;
}
themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.body.classList.add('light');
    localStorage.setItem('theme', 'light');
  } else {
    document.body.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  }
});

const roundsDropdown = document.getElementById('rounds');
roundsDropdown.addEventListener('change', () => {
  bestOf = parseInt(roundsDropdown.value);
  resetGame();
});

document.querySelectorAll('.move-button').forEach(button => {
  button.addEventListener('click', () => {
    if (!gameOver) {
      const move = button.getAttribute('data-move');
      playGame(move);
    }
  });
});

document.querySelector('.reset-button').addEventListener('click', () => {
  resetSound.play();
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.removeItem('score');
  updateScoreElement();
  resetGame();
});

function resetGame() {
  currentWins = 0;
  currentLosses = 0;
  currentTies = 0;
  gameOver = false;
  document.querySelector('.js-result').innerHTML = '';
  document.querySelector('.js-moves').innerHTML = '';
  updateScoreElement();
}

function playGame(playerMove) {
  clickSound.play();
  const computerMove = pickComputerMove();
  let result = '';

  if (playerMove === 'scissors') {
    result = (computerMove === 'rock') ? 'You lose' :
             (computerMove === 'paper') ? 'You win' : 'Tie';
  } else if (playerMove === 'paper') {
    result = (computerMove === 'rock') ? 'You win' :
             (computerMove === 'paper') ? 'Tie' : 'You lose';
  } else if (playerMove === 'rock') {
    result = (computerMove === 'rock') ? 'Tie' :
             (computerMove === 'paper') ? 'You lose' : 'You win';
  }

  if (result === 'You win') {
    winSound.play();
    score.wins++;
    currentWins++;
  } else if (result === 'You lose') {
    loseSound.play();
    score.losses++;
    currentLosses++;
  } else {
    tieSound.play();
    score.ties++;
    currentTies++;
  }

  localStorage.setItem('score', JSON.stringify(score));
  updateScoreElement();

  document.querySelector('.js-result').innerHTML = result;
  document.querySelector('.js-moves').innerHTML = `
    You <img src="images/${playerMove}.png" class="move-icon">
    vs <img src="images/${computerMove}.png" class="move-icon"> Computer
  `;

  checkRoundStatus();
}

function updateScoreElement() {
  document.querySelector('.js-score').innerHTML = `
    Wins: ${score.wins} | Losses: ${score.losses} | Ties: ${score.ties}<br>
    Round: ${currentWins + currentLosses + currentTies}/${bestOf}
    (W:${currentWins}, L:${currentLosses}, T:${currentTies})
  `;
}

function pickComputerMove() {
  const r = Math.random();
  return r < 1/3 ? 'rock' : r < 2/3 ? 'paper' : 'scissors';
}

function checkRoundStatus() {
  const totalRounds = currentWins + currentLosses + currentTies;
  const neededToWin = Math.ceil(bestOf / 2);

  if (currentWins >= neededToWin) {
    document.querySelector('.js-result').innerHTML = '🎉 You won the match!';
    gameOver = true;
  } else if (currentLosses >= neededToWin) {
    document.querySelector('.js-result').innerHTML = '💀 You lost the match.';
    gameOver = true;
  } else if (totalRounds >= bestOf) {
    if (currentWins > currentLosses) {
      document.querySelector('.js-result').innerHTML = '🎉 You won the match!';
    } else if (currentLosses > currentWins) {
      document.querySelector('.js-result').innerHTML = '💀 You lost the match.';
    } else {
      document.querySelector('.js-result').innerHTML = '⚖️ Match ended in a tie.';
    }
    gameOver = true;
  }
}
