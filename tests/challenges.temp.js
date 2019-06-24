export const challenges = [
    {
        name: 'Create a scatter plot for new features',
        points: 1,
        gradingMetric: 'accuracy',
        passingThreshold: 99,
        solution: [1, 2, 3, 4],
    },
    {
        name: 'Explain what you see ',
        points: 1,
        gradingMetric: 'f1',
        passingThreshold: 90,
        solution: [1, 0, 1, 0],
    },
    {
        name: 'Options to handle missing data',
        points: 1,
        gradingMetric: 'precision',
        passingThreshold: 95,
        solution: [1, 0, 1, 0],
    },
    {
        name: 'Build a Linear Regression Model',
        points: 1,
        gradingMetric: 'MAP',
        passingThreshold: 80,
        solution: [1, 0, 1, 0],
    },
];

// TODO: add tests for trying to add project with a metric that doesn't exist in judging engine