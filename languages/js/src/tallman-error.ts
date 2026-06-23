export class TallmanError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TallmanError';
    // Restore prototype chain for instanceof checks in transpiled environments.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
