/* eslint-disable max-len */
import { NonBinaryAnswerError } from './judging-errors';

const EPSILON = 1e-4;

export const zip = (xs, ys) => xs.map((x, i) => [x, ys[i]]);

export const isClose = (n1, n2, epsilon = EPSILON) => Math.abs(n1 - n2) < epsilon;

// Source: (Stack Overflow) https://stackoverflow.com/questions/874709/converting-user-input-string-to-regular-expression.
export const stringToRegex = (patternStr) => {
    const flags = patternStr.replace(/.*\/([gimy]*)$/, '$1');
    const pattern = patternStr.replace(new RegExp(`^/(.*?)/${flags}$`), '$1');
    return new RegExp(pattern, flags);
};

export const verifyBinaryContent = (contentToCheck) => {
    const binarySet = new Set([1, 0, 1.0, 0.0]);
    contentToCheck.forEach((value) => {
        // Expects list of 1s and 0s.
        if (!binarySet.has(parseFloat(value))) {
            throw new NonBinaryAnswerError('The expected answer only contains 1s and 0s.');
        }
    });
};

export const computeTruePositives = (predicted, truth) => zip(predicted, truth).reduce(
    (truePos, [predictedValue, trueValue]) => (parseFloat(predictedValue) === 1.0 && parseFloat(trueValue) === 1.0
        ? truePos + 1
        : truePos),
    0,
);

export const computeFalsePositives = (predicted, truth) => zip(predicted, truth).reduce(
    (truePos, [predictedValue, trueValue]) => (parseFloat(predictedValue) === 1.0 && parseFloat(trueValue) === 0.0
        ? truePos + 1
        : truePos),
    0,
);

export const computeTrueNegatives = (predicted, truth) => zip(predicted, truth).reduce(
    (truePos, [predictedValue, trueValue]) => (parseFloat(predictedValue) === 0.0 && parseFloat(trueValue) === 0.0
        ? truePos + 1
        : truePos),
    0,
);

export const computeFalseNegatives = (predicted, truth) => zip(predicted, truth).reduce(
    (truePos, [predictedValue, trueValue]) => (parseFloat(predictedValue) === 0.0 && parseFloat(trueValue) === 1.0
        ? truePos + 1
        : truePos),
    0,
);
