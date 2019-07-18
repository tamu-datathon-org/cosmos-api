import { IncorrectAnswerLengthError } from './judging-errors';
import {
    isClose,
    zip,
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

export const regexAccuracy = (predicted, truth) => {
    verifySameLength(predicted, truth);
    const numCorrect = zip(predicted, truth).reduce((total, [predictedValue, trueRegex]) => (
        (new RegExp(trueRegex).test(predictedValue))
            ? total + 1 : total
    ), 0);
    return numCorrect / predicted.length;
}

export const calcAccuracy = (predicted, truth) => {
    verifySameLength(predicted, truth);
    let numCorrect = 0;
    truth.forEach((trueValue, index) => {
        numCorrect += isClose(parseFloat(trueValue), parseFloat(predicted[index]));
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
