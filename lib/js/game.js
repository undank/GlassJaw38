import Display from './display';
import Render from './render';
import Animation from './animation';
import Input from './input';

class Game {
  constructor(canvas, currentOpponent) {

    this.gameOver = false;
    this.data = {
      animationFrame: 0,
      canvas,
      entityFrame: {
        littleMac: 0,
        glassJoe: 0
      },
      currentOpponent
    }

    this.audio = {
      fightTheme: new Audio("assets/audio/11-fight-theme.mp3"),
      winTheme: new Audio("assets/audio/14-you-win-.mp3"),
      loseTheme: new Audio("assets/audio/15-you-lose.mp3"),
      glassJoeTheme: new Audio("assets/audio/04-glass-joe-s-theme.mp3"),
      vonKaiserTheme: new Audio("assets/audio/05-von-kaiser-s-theme.mp3"),
      pistonHondaTheme: new Audio("assets/audio/06-piston-honda-s-theme.mp3"),
      bell: new Audio("assets/audio/bell.wav"),
      punchHit: new Audio("assets/audio/punch-hit.wav")

    }

    this.audio["fightTheme"].loop = true;
    this.loadAudioButtons();

    this.spriteSheets = {
      ring: new Image(),
      mac: new Image(),
      joe: new Image(),
      ref: new Image()
    }

    this.spriteSheets.opponent = new Image();
    console.log(currentOpponent);
    switch (currentOpponent) {
      case "glassJoe":
        this.loadSprites("opponent", "assets/img/glass_joe.png");
        break;
      case "vonKaiser":
        this.loadSprites("opponent", "assets/img/von_kaiser.png");
        break;
      default:
    }


    this.loadSprites("ring", "assets/img/ring-sprite.png");
    this.loadSprites("mac", "assets/img/little_mac2.png");
    this.loadSprites("joe", "assets/img/glass_joe.png");
    this.loadSprites("ref", "assets/img/ref_mario.png");

    this.input = new Input(this.data);
    this.winModal = document.getElementById("win-modal");
    this.loseModal = document.getElementById("lose-modal");
  }

  loadSprites(spriteName, filePath) {
    this.spriteSheets[spriteName].src = filePath;
    this.spriteSheets[spriteName].addEventListener("load", () => {
      this.data[`${spriteName}SpriteSheet`] = this.spriteSheets[spriteName];
      this.display = new Display(this.data);
      this.render = new Render(this.data);
    });
  }

  loadAudioButtons() {
    const MUTE_BTN = document.getElementById("mute-bgm");
    const UNMUTE_BTN = document.getElementById("unmute-bgm");

    MUTE_BTN.addEventListener("click", () => {
      this.audio["fightTheme"].muted = true;
    })

    UNMUTE_BTN.addEventListener("click", () => {
      this.audio["fightTheme"].muted = false;
    })
  }

  tutorial() {
    const loop = () => {
        if (this.animationOver) {
          return false;
        }
        this.updateAnimation(this.data);
        this.renderUpdate(this.data);
        this.data.animationFrame++;
        window.requestAnimationFrame(loop);
    }
    loop();
  }

  intro() {
    this.audio["glassJoeTheme"].play();
    this.data.canvas.ctxTop.font = '15px "Press Start 2P"';
    this.data.canvas.ctxTop.fillStyle = "white";
    this.data.canvas.ctxTop.fillText("#2 Minor Circuit: Glass Joe",150,120);
    this.data.canvas.ctxTop.font = '30px "Press Start 2P"';
    let counter = 3;
    let countdown = setInterval(() => {
      if (counter < 1) {
        clearInterval(countdown);
      }
      if (counter === 0) {
        counter = "Fight!";
        this.data.canvas.ctxTop.clearRect(0,0,800,300);
        this.data.canvas.ctxTop.fillText(`${counter}`,280,160);
        return false;
      }
      this.data.canvas.ctxTop.clearRect(0,120,800,200);
      this.data.canvas.ctxTop.fillText(`${counter}`,340,160);
      counter--;
    }, 1500)
  }

  roundStart() {
    this.audio["bell"].play();
    setTimeout(() => {
      this.audio["bell"].pause();
    }, 1100);
  }

  successfulHit() {
    if (this.data[this.data.currentOpponent].currentState.name === "prep" &&
      (this.data.littleMac.currentState.name === "leftJab" || this.data.littleMac.currentState.name === "rightJab")) {
      this.data[this.data.currentOpponent].currentState = this.data[this.data.currentOpponent].states.isHit;
      this.audio["punchHit"].play();
      this.data[this.data.currentOpponent].heartCount--;
      this.data[this.data.currentOpponent].heartMeter.removeChild(this.data[this.data.currentOpponent].heartMeter.firstChild);
      this.data[this.data.currentOpponent].heartMeter.removeChild(this.data[this.data.currentOpponent].heartMeter.firstChild);
      setTimeout(() => {
        this.data[this.data.currentOpponent].idle()
      }, 500);
      this.data.entityFrame[this.data.currentOpponent] = 0;
    } else {
      if (this.data.entityFrame[this.data.currentOpponent] > 100 && this.data.entityFrame[this.data.currentOpponent] < 150) {
        this.data[this.data.currentOpponent].prep(this.data);
      }
      if (this.data.entityFrame[this.data.currentOpponent] > 150) {
        this.data[this.data.currentOpponent].punch(this.data);
      }
    }

    if (this.data.entityFrame[this.data.currentOpponent] === 200) {
      this.data[this.data.currentOpponent].idle();
      this.data.entityFrame[this.data.currentOpponent] = 0;
    }
  }

  play() {
    this.audio["fightTheme"].play();

    const loop = () => {
      if (this.data[this.data.currentOpponent].heartCount < 1) {
        // this.data.canvas.ctxTop.font = '15px "Press Start 2P"';
        // this.data.canvas.ctxTop.fillStyle = "white";
        this.playerWin();
      }
      if (this.data.littleMac.heartCount < 1) {
        this.playerLose();
      }



      this.successfulHit();
      this.handleInput(this.data);
      this.updateAnimation(this.data);
      this.renderUpdate(this.data);

      this.data.animationFrame++;
      this.data.entityFrame.littleMac++;
      this.data.entityFrame[this.data.currentOpponent]++;

      if (!this.gameOver) {
        window.requestAnimationFrame(loop);
      }

    }

    loop();

  }

  handleInput(data) {
    this.input.keyUpdate(data);

  }

  updateAnimation(data) {
    Animation.update(data);
  }

  renderUpdate(data) {
    this.render.update(data)
  }

  playerWin() {
    this.winModal.classList.remove("hidden");
    this.audio["fightTheme"].muted = true;
    this.audio["winTheme"].play();
    this.gameOver = true;
    this.animationOver = false;

    // setTimeout(() => {
    //   this.animationOver= true;
      //// LOGIC TO START NEXT ROUND
    //   const nextRound = new Game(this.data.canvas, "glassJoe");
    //   setTimeout(() => {
    //     nextRound.play();
    //   }, 1000);
    // }, 5000);
    const loop = () => {
        if (this.animationOver) {
          return false;
        }
        this.data[this.data.currentOpponent].currentState = this.data[this.data.currentOpponent].states.isHit;
        this.data[this.data.currentOpponent].knockout();
        this.updateAnimation(this.data);
        this.renderUpdate(this.data);
        this.data.animationFrame++;
        window.requestAnimationFrame(loop);
    }
    loop();
  }

  playerLose() {
    this.loseModal.classList.remove("hidden");
    this.audio["fightTheme"].muted = true;
    this.audio["loseTheme"].play();
    this.gameOver = true;
  }
}

export default Game;
