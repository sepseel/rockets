const collisions = require('./collision');
const Rocket = require('./rocket');
const Bullet = require('./bullet');
const powerups = require('./powerUp');

class Game {

  constructor() {
    // arrays and dicts to keep track of all the objects in the game
    this.ids = [];
    this.players = {};
    this.bullets = [];
    this.powerups = [];
  }

  /**
   * Adding and removing objects to the game 
   */

  addPlayer(playerId) {
    this.ids.push(playerId);
    this.players[playerId] = new Rocket(200, 150, playerId);
  }
  addBullet(playerId) {
    this.bullets.push(new Bullet(
      this.players[playerId].getCoords(),
      this.players[playerId].getHeading(),
      playerId
    ));
  }
  addPowerup(type) {
    this.powerups.push(powerups.factory(type));
  }

  removePlayer(playerId) {
    this.ids = this.ids.filter(item => item !== playerId);
    this.players[playerId] = undefined;
  }
  removeBullet(bullet) {
    this.bullets = this.bullets.filter((item) => item !== bullet);
  }
  removePowerup(powerup) {
    this.powerups = this.powerups.filter((item) => item !== powerup);
  }

  /**
   * Removes all objects in the game that have their toDelete flag set
   */
  removeObjects() {
    for (let playerId of this.ids) {
      if (this.players[playerId].toDelete) {
        this.removePlayer(playerId);
      }
    }
    for (let bullet of this.bullets) {
      if (bullet.toDelete) {
        this.removeBullet(bullet);
      }
    }
    for (let powerup of this.powerups) {
      if (powerup.toDelete) {
        this.removePowerup(powerup);
      }
    }
  }


  /**
   * Updating all the objects in the game
   */

  update() {
    this.updatePlayers();
    this.updateBullets();
    this.checkCollisions();
    if (Math.floor(Math.random()*100) > 99) {
      this.addPowerup("speedboost");
    }
  }
  updatePlayers() {
    for (let playerId of this.ids) {
      if (this.players[playerId]) { // only update a player if it still exists
        this.players[playerId].update();
        this.players[playerId].turn(this.players[playerId].dir);
      }
    }
  }
  updateBullets() {
    for (let bullet of this.bullets) {
      bullet.update();
      if (bullet.collidesWithEdges()) this.removeBullet(bullet)
    }
  }
  // TODO move more collision code to seperate file
  checkCollisions() {
    let player;
    for (let playerId of this.ids) {
      player = this.players[playerId];
      this.checkBulletCollisions(player);
      this.checkPowerupCollisions(player);
    }
    this.removeObjects();
  }
  checkPowerupCollisions(player) {
    for (let powerup of this.powerups) {
      if (collisions.playerPowerUp(player.coords, powerup.coords)) {
        powerup.handle(player);
        powerup.toDelete = true;
        if (powerup.type === "ammo") {
        }
      }
    }
  }
  checkBulletCollisions(player) {
    for (let bullet of this.bullets) {
      if (
        player.id !== bullet.ownerId &&
        collisions.playerBullet(player.coords, bullet.coords)
      ) {
        player.toDelete = true;
        bullet.toDelete = true;
      }
    }
  }

  /**
   * Handles the input from a player 
   * @param {*} playerId id of the player sending input
   * @param {*} input object containing the inputs 
   */
  handleInput(playerId, input) {
    let player = this.players[playerId];

    // handle shooting
    if (input.SPACE) {
      if (player.hasAmmo()) { // only shoot if the player has ammo
        player.shoot();
        this.addBullet(playerId);
      }
      return // do nothing else but shoot
    }

    // handle turning
    if (input.LEFT_ARROW || input.RIGHT_ARROW) {
      player.dir = input.LEFT_ARROW ? -1 : 1;
    } else {
      player.dir = 0;
    }

    // handle accelerating
    player.thrust(input.UP_ARROW);
  }
  
  /**
   * getters for the server to send the objects to the client
   */

  getRockets() {
    let rockets = [];
    for (let id of this.ids) {
      rockets.push({
        coords: this.players[id].coords, 
        angle: this.players[id].angle, 
        thrusting: this.players[id].thrusting,
        ammo: this.players[id].ammo,
        id: id
      })
    }
    return rockets;
  }
  getBullets() {
    return this.bullets;
  }
  getPowerups() {
    return this.powerups;
  }
}

module.exports = Game;