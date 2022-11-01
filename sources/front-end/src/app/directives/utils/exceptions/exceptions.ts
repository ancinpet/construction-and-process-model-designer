export class FatalError extends Error {
    constructor(message?: string) {
        super("Application is unable to recover. " + message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}