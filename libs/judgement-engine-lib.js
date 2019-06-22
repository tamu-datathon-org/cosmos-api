import * as metrics from './judging/metrics';
import * as judgingErrors from './judging/judging-errors';

const METRICS_MAP = {
    accuracy: metrics.calcAccuracy,
    precision_binary: metrics.calcPrecisionBinary,
    recall_binary: metrics.calcRecallBinary,
    f1_binary: metrics.calcF1Binary,
};

export const judge = (predicted, truth, metric) => {
    if (!(metric in METRICS_MAP)) {
        throw new judgingErrors.MetricNotFoundError('The given metric was not found.');
    }
    const metricFunc = METRICS_MAP[metric];
    return metricFunc(predicted, truth);
};
