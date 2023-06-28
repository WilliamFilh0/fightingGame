class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale //image size
    this.framesMax = framesMax
    this.frameCurrent = 0 //stores the index of the current frame being displayed in the animation
    this.framesElapsed = 0//Stores the number of frames that have passed since the last frame change. It is incremented with each update.
    this.framesHold = 5//: Defines the number of frames that must pass before updating frameCurrent. When framesElapsed reaches a value that is an exact multiple of framesHold, the animation advances to the next frame.
  }

  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }

  update() {
    this.draw()
    this.framesElapsed++

    //checks if enough time has passed to update the frame
    if (this.framesElapsed % this.framesHold === 0) {
      //shop animation repeat loop
      if (this.frameCurrent < this.framesMax - 1) {
        this.frameCurrent++
      } else {
        this.frameCurrent = 0
      }
    }
  }
}


class Fighter extends Sprite{
  constructor({ position, velocity, color = 'red', offset, imageSrc, scale = 1, framesMax = 1  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      
    })
    this.position = position
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey = null // Add lastKey property to each sprite
    this.attackBox = {
      //Represents the fighter's position in space, with x and y coordinates.
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset, //It is an object that defines an offset for the attack box in relation to the fighter's position.
      width: 100,
      height: 50
    }
    this.color = color
    this.isAttacking
    this.health = 100
    this.frameCurrent = 0 //stores the index of the current frame being displayed in the animation
    this.framesElapsed = 0//Stores the number of frames that have passed since the last frame change. It is incremented with each update.
    this.framesHold = 5
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
//2;23;14