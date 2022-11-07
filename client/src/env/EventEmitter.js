class EventEmitter {
  constructor() {
    this.event = {};
  }
  subscribe(action, callback) {
    if (!this.event[action]) {
      this.event[action] = [];
    }
    this.event[action].push(callback);
  }
  unSubscribe(action, callback) {
    if (!this.event[action]) return;
    this.event[action] = this.event[action].filter(
      (cb) => cb != callback
    );
  }
  dispatch(action, payload) {
    if (!this.event[action]) return;
    this.event[action].forEach((cb) => cb(payload));
  }
}

const eventEmitter = new EventEmitter();

export default eventEmitter;
export { EventEmitter };
