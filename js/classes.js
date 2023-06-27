class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax
  }

  draw() {
    c.drawImage(
      this.image,
      0,
      0,
      this.image.width /6,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / 6) * this.scale,
      this.image.height * this.scale)
  }

  update() {
    this.draw()
  }
}

class Fighter {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey = null // Add lastKey property to each sprite
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
    } else if (this.position.x + this.width > canvas.width) {
      this.position.x = canvas.width - this.width
    }

    // Prevents the sprite from leaving the vertical limits of the screen
    if (this.position.y < 0) {
      this.position.y = 0
      this.velocity.y = 0
    } else if (this.position.y + this.height > canvas.height) {
      this.position.y = canvas.height - this.height
      this.velocity.y = 0
    }

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
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