const score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

updateScoreElement();

document.querySelectorAll('.move-button').forEach(button => {
  button.addEventListener('click', () => {
    const move = button.getAttribute('data-move');
    playGame(move);
  });
});

document.querySelector('.reset-button').addEventListener('click', () => {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.removeItem('score');
  updateScoreElement();
});

function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = '';

  if (playerMove === 'scissors') {
    if (computerMove === 'rock') result = 'You lose';
    else if (computerMove === 'paper') result = 'You win';
    else result = 'Tie';
  } else if (playerMove === 'paper') {
    if (computerMove === 'rock') result = 'You win';
    else if (computerMove === 'paper') result = 'Tie';
    else result = 'You lose';
  } else if (playerMove === 'rock') {
    if (computerMove === 'rock') result = 'Tie';
    else if (computerMove === 'paper') result = 'You lose';
    else result = 'You win';
  }

  if (result === 'You win') score.wins++;
  else if (result === 'You lose') score.losses++;
  else score.ties++;

  localStorage.setItem('score', JSON.stringify(score));
  updateScoreElement();

  document.querySelector('.js-result').innerHTML = result;
  document.querySelector('.js-moves').innerHTML = `
    You <img src="images/${playerMove}.png" class="move-icon">
    vs <img src="images/${computerMove}.png" class="move-icon"> Computer
  `;
}

function updateScoreElement() {
  document.querySelector('.js-score').innerHTML =
    `Wins: ${score.wins} | Losses: ${score.losses} | Ties: ${score.ties}`;
}

function pickComputerMove() {
  const randomNumber = Math.random();
  if (randomNumber < 1/3) return 'rock';
  else if (randomNumber < 2/3) return 'paper';
  else return 'scissors';
}
