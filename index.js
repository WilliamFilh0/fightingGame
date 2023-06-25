const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey = null // Adiciona a propriedade lastKey para cada sprite
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset,
      width: 100,
      height: 50
    }
    this.color = color
    this.isAttacking
    this.health = 100
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    //attack box
    if (this.isAttacking) {
      c.fillStyle = 'green'
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height,

      )
    }
  }

  update() {
    this.draw()
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y

    // Impede que o sprite saia dos limites horizontais da tela
    if (this.position.x < 0) {
      this.position.x = 0
    } else if (this.position.x + 50 > canvas.width) {
      this.position.x = canvas.width - 50
    }

    // Impede que o sprite saia dos limites verticais da tela
    if (this.position.y < 0) {
      this.position.y = 0
      this.velocity.y = 0
    } else if (this.position.y + this.height > canvas.height) {
      this.position.y = canvas.height - this.height
      this.velocity.y = 0
    }

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0
    } else {
      this.velocity.y += gravity
    }
  }

  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100);


  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0
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

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100
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
function determineWinner({ player, enemy,TimerId }) {
  cancelTimeout(TimerId)
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
let TimerId
function decreaseTimer() {
  if (timer > 0) {
    TimerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }
  //condition to determine who wins when resetting the timer
  if (timer === 0) {
    determineWinner({ player, enemy })
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
    determineWinner({ player, enemy })
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

//1:49:14
