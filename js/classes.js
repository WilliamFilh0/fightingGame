class Sprite {
  constructor({ position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 }
  }) {
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
    this.offset = offset
  }

  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
  }

  animateFrames() {
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

  update() {
    this.draw()
    this.animateFrames()
  }
}


class Fighter extends Sprite {
  constructor({ position,
    velocity,
    color = 'red',
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
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
    this.sprites = sprites

    for (const sprite in sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc

    }
  }


  update() {
    this.draw()
    this.animateFrames()

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

    //gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0
      this.position.y = 330
    } else this.velocity.y += gravity


  }

  attack() {
    this.switchSprite('attack1')
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }


  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack1.image && this.frameCurrent < this.sprites.attack1.framesMax -1) return
      
    switch (sprite) {
      case 'idle':
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image
          this.framesMax = this.sprites.idle.framesMax
          this.frameCurrent = 0
        }
        break;
      case 'run':
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image
          this.framesMax = this.sprites.run.framesMax
          this.frameCurrent = 0
        }
        break;
      case 'jump':
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image
          this.framesMax = this.sprites.jump.framesMax
          this.frameCurrent = 0
        }
        break;

      case 'fall':
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image
          this.framesMax = this.sprites.fall.framesMax
          this.frameCurrent = 0
        }
        break;

      case 'attack1':
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image
          this.framesMax = this.sprites.attack1.framesMax
          this.frameCurrent = 0
        }
        break;
    }
  }

}
