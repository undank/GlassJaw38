class Input {
  constructor(data) {

    this.validInputs = ["a","A","d","D","ArrowLeft","ArrowRight"]

    data.animationRunning = false;

    window.addEventListener('keyup', (e) => {
      this.fired = false;
    })

    window.addEventListener('keydown', (e) => {
      if (this.fired) {
        return false
      }
      this.fired = true

      if (this.validInputs.includes(e.key)) {
        switch (e.key) {
          case 'a':
          case 'A':
          case 'd':
          case 'D':
            this.animationLength = 400;
            break;
          case 'ArrowLeft':
          case 'ArrowRight':
            this.animationLength = 300;
            break;
          default:
        }

        if (data.animationRunning === false) {
          data.keyPress = e.key;
        }

        setTimeout(() => {
          data.keyPress = false;
        }, 50)
        setTimeout(() => {
          data.animationRunning = false;
          this.resetEntityPosition(data);
          data.littleMac.currentState = data.littleMac.states.idle;
        }, this.animationLength);
      }
    })
  }

  resetEntityPosition(data) {
    data.littleMac.x = 320;
  }

  keyUpdate(data) {
    if (!data.animationRunning) {
        switch (data.keyPress) {
        case "a":
        case "A":
          data.animationRunning = true;
          if (data.entityFrame.littleMac > 30) {
             data.entityFrame.littleMac = 0;
          }
          if (data.littleMac.energyCount > 0) {

            data.littleMac.currentState = data.littleMac.states.leftJab;

            if (data[data.currentOpponent].currentState.name === "idle") {
              data[data.currentOpponent].currentState = data[data.currentOpponent].states.isBlocking;
            } else if (data[data.currentOpponent].currentState.name === "prep") {
                data[data.currentOpponent].currentState = data[data.currentOpponent].states.isHit;
            }

            data.littleMac.energyCount--;
            data.littleMac.energyMeter.removeChild(data.littleMac.energyMeter.lastChild);
            data.littleMac.energyMeter.removeChild(data.littleMac.energyMeter.lastChild);
          } else {
            data.littleMac.currentState = data.littleMac.states.noEnergy;
          }
          break;
        case "d":
        case "D":
        if (data.littleMac.energyCount > 0) {
          data.animationRunning = true;
            if (data.entityFrame.littleMac > 30) {
               data.entityFrame.littleMac = 0;
            }
            data.littleMac.currentState = data.littleMac.states.rightJab;

            if (data[data.currentOpponent].currentState.name === "idle") {
              data[data.currentOpponent].currentState = data[data.currentOpponent].states.isBlocking;
            } else if (data[data.currentOpponent].currentState.name === "prep") {
                data[data.currentOpponent].currentState = data[data.currentOpponent].states.isHit;
            }
            if (data.littleMac.energyCount > 0) {
              data.littleMac.energyCount--;
              data.littleMac.energyMeter.removeChild(data.littleMac.energyMeter.lastChild);
              data.littleMac.energyMeter.removeChild(data.littleMac.energyMeter.lastChild);
            }
          }
          break;
        case "ArrowLeft":
          if (data.entityFrame.littleMac > 20) {
             data.entityFrame.littleMac = 0;
          }
            data.littleMac.currentState = data.littleMac.states.leftDodge;
          break;
        case "ArrowRight":
          if (data.entityFrame.littleMac > 20) {
             data.entityFrame.littleMac = 0;
          }
            data.littleMac.currentState = data.littleMac.states.rightDodge;
          break;
        default:
      }
    }
  }


}

export default Input;
