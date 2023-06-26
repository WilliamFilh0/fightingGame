const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7



const player = new Fighter({
  /*position: {
    x: 0,
    y: 0
  },*/
  //posição inicial do jogador
  position: {
    x: canvas.width / 4 - 25,
    y: canvas.height / 2 - 75
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  }
})

const enemy = new Fighter({
  /*position: {
    x: 400,
    y: 100
  },*/
  //posição inicial do inimigo
  position: {
    x: (canvas.width * 3) / 4 - 25,
    y: canvas.height / 2 - 75
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  }
});


console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}
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

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // Player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
  }

  // detect for colision
  if (
    rectangularCollision({
      rectanlel1: player,
      rectanlel2: enemy
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false
    enemy.health -= 20
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }



  if (
    rectangularCollision({
      rectanlel1: enemy,
      rectanlel2: player
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
    player.health -= 20
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }
  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}


animate()

window.addEventListener('keydown', (event) => {

  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'w':
      player.velocity.y = -20
      break
    case ' ':
      player.attack()
      break

    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowUp':
      enemy.velocity.y = -20
      break
    case 'ArrowDown':
      enemy.isAttacking = true
      break

  }

})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }

  // Enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }

})

