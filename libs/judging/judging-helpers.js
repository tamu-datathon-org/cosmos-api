import { NonBinaryAnswerError } from './judging-errors';

export const verifyBinaryContent = (contentToCheck) => {
    const binarySet = new Set([1, 0, 1.0, 0.0]);
    contentToCheck.forEach((value) => {
        // Expects list of 1s and 0s.
        if (!binarySet.has(parseFloat(value))) {
            throw NonBinaryAnswerError('The expected answer only contains 1s and 0s.');
        }
    });
};

export const computeTruePositives = (predicted, truth) => {
    let truePositives = 0;
    truth.forEach((trueValue, index) => {
        truePositives += (parseFloat(predicted[index]) === 1) && (parseFloat(trueValue) === 1);
    });
    return truePositives;
};

export const computeFalsePositives = (predicted, truth) => {
    let falsePositives = 0;
    truth.forEach((trueValue, index) => {
        falsePositives += (parseFloat(predicted[index]) === 1) && (parseFloat(trueValue) === 0);
    });
    return falsePositives;
};

export const computeTrueNegatives = (predicted, truth) => {
    let trueNegatives = 0;
    truth.forEach((trueValue, index) => {
        trueNegatives += (parseFloat(predicted[index]) === 0) && (parseFloat(trueValue) === 0);
    });
    return trueNegatives;
};

export const computeFalseNegatives = (predicted, truth) => {
    let falseNegatives = 0;
    truth.forEach((trueValue, index) => {
        falseNegatives += (parseFloat(predicted[index]) === 0) && (parseFloat(trueValue) === 1);
    });
    return falseNegatives;
};
