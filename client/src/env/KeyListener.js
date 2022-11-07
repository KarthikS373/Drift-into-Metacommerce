class KeyListener {
  constructor(event) {
    this.keys = {};
    this.caster = event || console.log;
  }

  setCaster(event) {
    this.caster = event;
  }

  isPressed(keyCode) {
    return this.keys[keyCode] ? this.keys[keyCode] : false;
  }

  down(e) {
    if (this.keys[e.keyCode]) return;
    this.keys[e.keyCode] = true;
    this.caster([e.keyCode, true, this.keys]);
    e.preventDefault();
    e.stopPropagation();
  }

  up(e) {
    this.keys[e.keyCode] = false;
    this.caster([e.keyCode, false, this.keys]);
    e.preventDefault();
    e.stopPropagation();
  }

  start() {
    console.log("Keyboard Binding Init");
    window.addEventListener("keydown", this.down.bind(this));
    window.addEventListener("keyup", this.up.bind(this));
  }

  stop() {
    console.log("Keyboard Binding Disposed");
    window.removeEventListener("keydown", this.down.bind(this));
    window.removeEventListener("keyup", this.up.bind(this));
  }
}

const keyListener = new KeyListener();

export default keyListener;
