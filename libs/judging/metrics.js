import {
    IncorrectAnswerLengthError,
} from './judging-errors';
import {
    verifyBinaryContent,
    computeTruePositives,
    computeFalsePositives,
    computeFalseNegatives,
} from './judging-helpers';

const verifySameLength = (predicted, truth) => {
    if (predicted.length !== truth.length) {
        throw IncorrectAnswerLengthError();
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
    verifyBinaryContent(predicted);
    const truePositives = computeTruePositives(predicted, truth);
    const falsePositives = computeFalsePositives(predicted, truth);
    return truePositives / (truePositives + falsePositives);
};

export const calcRecallBinary = (predicted, truth) => {
    verifySameLength(predicted, truth);
    verifyBinaryContent(predicted);
    const truePositives = computeTruePositives(predicted, truth);
    const falseNegatives = computeFalseNegatives(predicted, truth);
    return truePositives / (truePositives + falseNegatives);
};

export const calcF1Binary = (predicted, truth) => {
    const precision = calcPrecisionBinary(predicted, truth);
    const recall = calcRecallBinary(predicted, truth);
    return 2 * ((precision * recall) / (precision + recall));
};