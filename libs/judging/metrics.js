import { IncorrectAnswerLengthError, NonBinaryAnswerError } from './judging-errors';


const verifySameLength = (predicted, truth) => {
    if (predicted.length !== truth.length) {
        throw IncorrectAnswerLengthError('The length of the truth and the submission do not match.');
    }
};

export const calcAccuracy = (predicted, truth) => {
    verifySameLength(predicted, truth);
    let numCorrect = 0;
    truth.forEach((trueValue, index) => {
        numCorrect += parseFloat(trueValue) === parseFloat(predicted[index]);
    });
    return numCorrect / predicted.length;
};

export const calcPrecisionBinary = (predicted, truth) => {
    verifySameLength(predicted, truth);
    let truePositives = 0;
    let falsePositives = 0;
    const binarySet = new Set([1, 0, 1.0, 0.0]);
    truth.forEach((trueValue, index) => {
        // Expects list of 1s and 0s.
        if (!binarySet.has(parseFloat(predicted[index]))) {
            throw NonBinaryAnswerError('The expected answer only contains 1s and 0s.');
        }
        truePositives += (parseFloat(trueValue) === 1) && (parseFloat(predicted[index]) === 1);
        falsePositives += (parseFloat(trueValue) === 0) && (parseFloat(predicted[index]) === 1);
    });
    return truePositives / (truePositives + falsePositives);
};

export const calcRecallBinary = (predicted, truth) => {
    verifySameLength(predicted, truth);
    let truePositives = 0;
    let falseNegatives = 0;
    const binarySet = new Set([1, 0, 1.0, 0.0]);
    truth.forEach((trueValue, index) => {
        // Expects list of 1s and 0s.
        if (!binarySet.has(parseFloat(predicted[index]))) {
            throw NonBinaryAnswerError('The expected answer only contains 1s and 0s.');
        }
        truePositives += (parseFloat(trueValue) === 1) && (parseFloat(predicted[index]) === 1);
        falseNegatives += (parseFloat(trueValue) === 1) && (parseFloat(predicted[index]) === 0);
    });
    return truePositives / (truePositives + falseNegatives);
};

export const calcF1Binary = (predicted, truth) => {
    const precision = calcPrecisionBinary(predicted, truth);
    const recall = calcPrecisionBinary(predicted, truth);
    return 2 * ((precision * recall) / (precision + recall));
};
