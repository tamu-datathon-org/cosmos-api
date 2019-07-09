export class NotFoundError extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'NotFoundError';
    }
}