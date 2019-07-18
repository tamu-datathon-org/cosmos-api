export class IncorrectAnswerLengthError extends Error {
    constructor() {
        super('The length of the truth and the submission do not match.');
        this.name = 'IncorrectAnswerLengthError';
    }
}

export class NonBinaryAnswerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NonBinaryAnswerError';
    }
}

export class MetricNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MetricNotFoundError';
    }
}
