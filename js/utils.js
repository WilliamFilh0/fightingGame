function rectangularCollision({ rectanlel1, rectanlel2 }) {
  return (
    rectanlel1.attackBox.position.x + rectanlel1.attackBox.width >= rectanlel2.position.x &&
    rectanlel1.attackBox.position.x <= rectanlel2.position.x + rectanlel2.width &&
    rectanlel1.attackBox.position.y + rectanlel1.attackBox.height >= rectanlel2.position.y &&
    rectanlel1.attackBox.position.y <= rectanlel2.position.y + rectanlel2.height
  );
}

//function that determines who wins
function determineWinner({ player, enemy,timerId }) {
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if (PaymentRequest.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
  }
}


//timer function
let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }
  //condition to determine who wins when resetting the timer
  if (timer === 0) {
    determineWinner({ player, enemy, timerId })
  }
}
