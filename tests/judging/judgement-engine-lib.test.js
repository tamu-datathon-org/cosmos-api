import { judge } from '../../libs/judgement-engine-lib';

// Metrics.
const ACCURACY = 'accuracy';
const PRECISION_BINARY = 'precision_binary';
const RECALL_BINARY = 'recall_binary';
const F1_BINARY = 'f1_binary';

// Test values.
const shortPredicted = [1, 2, 3.4];

const truthNonBinary = [1.2, 3.4, 5.6, 7.89, 10.1112, 100.1234, 8, 60];
// Mismatch at index 0 & 6. Accuracy: 0.75.
const predictedNonBinary = [2, 3.4, 5.6, 7.89, 10.1112, 100.1234, 12, 60];

// Accuracy: 9/14. True Pos: 5. False Pos: 2. True Neg: 4. False Neg: 3.
const truthBinary = [1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1];
const predictedBinary = [1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0];

test('Judgement Engine: Length Mismatch', async () => {
    expect(() => judge(shortPredicted, truthNonBinary, ACCURACY)).toThrow();
});

test('Judgement Enginer: Non Binary Accuracy', async () => {
    const accuracy = judge(predictedNonBinary, truthNonBinary, ACCURACY);
    expect(accuracy).toEqual(0.75);
});

test('Judgement Enginer: Binary Accuracy', async () => {
    const accuracy = judge(predictedBinary, truthBinary, ACCURACY);
    expect(accuracy).toEqual(9 / 14);
});

test('Judgement Enginer: Binary Precision', async () => {
    const accuracy = judge(predictedBinary, truthBinary, PRECISION_BINARY);
    expect(accuracy).toEqual(5 / 7);
});

test('Judgement Enginer: Binary Recall', async () => {
    const accuracy = judge(predictedBinary, truthBinary, RECALL_BINARY);
    expect(accuracy).toEqual(5 / 8);
});

test('Judgement Enginer: Binary F1', async () => {
    const accuracy = judge(predictedBinary, truthBinary, F1_BINARY);
    const expectedF1 = (2 * (((5 / 8) * 5) / 7)) / (5 / 8 + 5 / 7);
    expect(accuracy).toEqual(expectedF1);
});
