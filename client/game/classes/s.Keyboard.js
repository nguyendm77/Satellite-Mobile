s.Keyboard = function() {
  this.keyCodes = {};

  this.handleKeyDown = this.handleKeyChange.bind(this, true);
  this.handleKeyUp = this.handleKeyChange.bind(this, false);

  // Listen to key events
  window.addEventListener('keydown', this.handleKeyDown, false);
  window.addEventListener('keyup', this.handleKeyUp, false);
};

s.Keyboard.prototype.keys = {
  'left'    : 37,
  'up'      : 38,
  'right'   : 39,
  'down'    : 40,
  'space'   : 32,
  'pageup'  : 33,
  'pagedown': 34,
  'tab'     : 9,
  'w'       : 87,
  'a'       : 65,
  's'       : 83,
  'd'       : 68,
  'e'       : 69,
  'backtick': 192,
  'shift'   : 16,
  'tilde'   : 192,
  'enter'   : 13
};

s.Keyboard.prototype.keysInv = {
  37  : 'left',
  38  : 'up',
  39  : 'right',
  40  : 'down',
  32  : 'space',
  33  : 'pageup',
  34  : 'pagedown',
  9   : 'tab',
  87  : 'w',
  65  : 'a',
  83  : 's',
  68  : 'd',
  192 : 'tilde',
  16  : 'shift',
};

s.Keyboard.prototype.modifiers = ['shift', 'ctrl', 'alt', 'meta'];

s.Keyboard.prototype.destruct = function() {
  window.removeEventListener('keydown', this.handleKeyDown);
  window.removeEventListener('keyup', this.handleKeyUp);
};

s.Keyboard.prototype.handleKeyChange = function(pressed, e) {
  var keyCode = e.keyCode;
  this.keyCodes[keyCode] = pressed;

  // update this.modifiers
  this.modifiers.shift = e.shiftKey;
  this.modifiers.ctrl = e.ctrlKey;
  this.modifiers.alt = e.altKey;
  this.modifiers.meta = e.metaKey;
};

s.Keyboard.prototype.pressed = function(keyDesc) {
  var keys = keyDesc.split("+");
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var pressed;
    if (this.modifiers.indexOf(key) !== -1) {
      pressed = this.modifiers[key];
    }
    else if (Object.keys(this.keys).indexOf(key) != -1) {
      pressed = this.keyCodes[this.keys[key]];
    }
    else {
      pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)];
    }

    if(!pressed) return false;
  }

  return true;
};
