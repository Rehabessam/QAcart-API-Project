const listeners = {};

export default class EventListener {
  constructor(event) {
    this.event = event;

    if ( Array.isArray(listeners[event]) === false )
      listeners[event] = [];

    return this;
  }

  set(callback) {
    return EventListener.setListener(this.event, callback);
  }

  remove(index) {
    return EventListener.removeListener(this.event, index);
  }

  run = async (...args) => {
    const events = listeners[this.event];

    if ( Array.isArray(events) === false )
      return false;

    for (const event of events) {
      try {
        await Promise.resolve( event(...args) );
      } catch (e) {
        logger(e);
        return false;
      }
    }

    return true;
  }

  static setListener(event, callback) {
    const index = listeners[event].push(callback);

    return index - 1;
  }

  static removeListener(event, index) {
    try {
      const updated = listeners[event].filter((item, position) => index !== position);

      return true;
    } catch (e) {
      return false;
    }
  }
}

export { Events } from "./events";
