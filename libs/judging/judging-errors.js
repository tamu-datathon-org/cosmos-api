
export class IncorrectAnswerLengthError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}

export class NonBinaryAnswerError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}

export class MetricNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}