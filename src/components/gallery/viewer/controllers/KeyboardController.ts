export class KeyboardController {
  private keyStates: { [key: string]: boolean } = {};
  private handlers: { [key: string]: () => void } = {};

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  registerHandler(key: string, handler: () => void) {
    this.handlers[key.toLowerCase()] = handler;
  }

  isKeyPressed(key: string): boolean {
    return this.keyStates[key.toLowerCase()] || false;
  }

  enable() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  disable() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.keyStates = {};
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    this.keyStates[key] = true;
    if (this.handlers[key]) {
      this.handlers[key]();
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    this.keyStates[key] = false;
  }

  cleanup() {
    this.disable();
    this.handlers = {};
  }
}