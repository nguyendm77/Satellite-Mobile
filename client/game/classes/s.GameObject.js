s.GameObject = new Class({
  toString: 'GameObject',
  extend: s.EventEmitter,

  construct: function(options) {
    if (options.rotation) {
      if (!(options.rotation instanceof THREE.Quaternion)) {
        throw new Error('s.GameObject: options.rotation should be a THREE.Quaternion');
      }
    }

    // Bind execution scope of update, if necessary
    if (this.update)
      this.update = this.update.bind(this);

    // Store scene for remove
    this.game = options.game;

    // Store options
    this.options = options;
  },

  init: function() {
    if (this.root) {
      // Position mesh in scene
      if (this.options.position) {
        this.root.position.copy(this.options.position);
      }
      if (this.options.rotation) {
        this.root.quaternion.copy(this.options.rotation);
      }
    }

    if (this.body) {
      // Store a reference to the instance on the object
      // This is used after a collision is detected
      // For instance, to remove HP from the item hit
      // this.body.instance = this;

      // Position body in physics simulation
      // Manually assign values so both CANNON and THREE math types are supported
      if (this.options.position) {
        this.body.position.set(this.options.position.x, this.options.position.y, this.options.position.z);
      }
      if (this.options.rotation) {
        this.body.quaternion.set(this.options.rotation.x, this.options.rotation.y, this.options.rotation.z, this.options.rotation.w);
      }
      if (this.options.velocity) {
        this.body.velocity.set(this.options.velocity.x, this.options.velocity.y, this.options.velocity.z);
      }
      if (this.options.angularVelocity) {
        this.body.angularVelocity.set(this.options.angularVelocity.x, this.options.angularVelocity.y, this.options.angularVelocity.z);
      }
    }

    this.add();
  },

  destruct: function() {
    // Unhook from the rendering loop
    if (this.update) {
      this.game.unhook(this.update);
    }

    // Remove from physics simulation
    if (this.body) {
      this.game.world.remove(this.body);
    }

    // Remove from the scene
    if (this.root) {
      this.game.scene.remove(this.root);
    }
  },

  add: function() {
    // Add mesh to world
    if (this.root) {
      this.game.scene.add(this.root);
    }

    if (this.body) {
      this.game.world.add(this.body);
    }

    // Hook to the rendering loop
    if (this.update && !this.hooked) {
      this.game.hook(this.update);
      this.hooked = true;
    }

    return this;
  },

  update: function() {
    if (this.body) {
      // Copy coordinates from Cannon.js to Three.js
      this.body.position.copy(this.root.position);
      this.body.quaternion.copy(this.root.quaternion);
    }
  },

  getRoot: function() {
    return this.root;
  },

  show: function() {
    this.root.visible = true;
  },

  hide: function() {
    this.root.visible = false;
  }
});