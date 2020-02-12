const config = require("./config");

/**
 * Basic powerup sctructure
 */
class PowerUp {
  constructor(x, y, lifeSpan) {
    this.coords = {x: x, y: y};
    this.toDelete = false;
    setTimeout(() => {
      this.toDelete = true;
    }, lifeSpan*1000);
  }

  handle(rocket) {
    // Do something to the rocket
  }
}

/** 
 * this powerup gives the player extra ammo
 */
class AmmoPickup extends PowerUp {
  constructor(x, y, lifeSpan, amt) {
    super(x, y, lifeSpan);
    this.amt = amt;
    this.type = "ammo";
  }

  handle(rocket) {
    rocket.reload(this.amt);
  }
}

/**
 * this powerup gives the player a speedboost
 */
class SpeedBoost extends PowerUp {
  constructor(x, y, lifeSpan, duration) {
    super(x, y, lifeSpan);
    this.duration = duration;
    this.type = "speedboost";
  }

  handle(rocket) {
    rocket.boost(true);
    this.rocket = rocket; // storing the rocket to use in the callback
    setTimeout(() => {
      this.rocket.boost(false);
    }, this.duration*1000);
  }
}

// TODO move to utils package?
/**
 * helper funtion that generates a random integer between 0 and the given maximum 
 * @param {int} max the maximum value for the generated int
 */
function randomInt(max) {
  return Math.floor(Math.random()*max);
}

/**
 * builds a powerup of a given type and returns it 
 * @param {string} type determines the type of powerup that will be built
 */
function powerupFactory(type) {
  let powerup;
  console.log("powerup")
  switch (type) {
    case "ammo":
      powerup = new AmmoPickup(
        randomInt(config.WIDTH-30)+15,
        randomInt(config.HEIGHT-30)+15,
        randomInt(10)+config.MIN_LIFESPAN,
        config.MAX_AMMO
      );
      break;
    case "speedboost":
      powerup = new SpeedBoost(
        randomInt(config.WIDTH-30)+15,
        randomInt(config.HEIGHT-30)+15,
        randomInt(10)+config.MIN_LIFESPAN,
        randomInt(5)+config.MIN_BOOST_DURATION
      );
      break;
    }
    return powerup;
}

// only expose the factory
module.exports.factory = powerupFactory;