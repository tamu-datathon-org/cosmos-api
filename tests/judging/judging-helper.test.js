import * as judgingHelper from '../../libs/judging/judging-helpers';

const testTruth = [0, 1, 1, 1, 0, 1, 1, 0, 1, 1];
const testPredicted = [1, 0, 1, 0, 0, 1, 1, 1, 0, 1];
const invalidPredicted = [1, 0, 0, 1, 1.3, 2.5, 1.7];

test('Judging-Helper: Invalid Prediction', async () => {
    expect(() => {
        judgingHelper.verifyBinaryContent(invalidPredicted);
    }).toThrow();
});

test('Judging Helper: True Positives', async () => {
    const truePos = judgingHelper.computeTruePositives(testPredicted, testTruth);
    expect(truePos).toEqual(4);
});

test('Judging Helper: False Positives', async () => {
    const falsePos = judgingHelper.computeFalsePositives(testPredicted, testTruth);
    expect(falsePos).toEqual(2);
});

test('Judging Helper: True Negatives', async () => {
    const trueNeg = judgingHelper.computeTrueNegatives(testPredicted, testTruth);
    expect(trueNeg).toEqual(1);
});

test('Judging Helper: False Negatives', async () => {
    const falseNeg = judgingHelper.computeFalseNegatives(testPredicted, testTruth);
    expect(falseNeg).toEqual(3);
});