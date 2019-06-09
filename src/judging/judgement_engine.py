from .metrics import MetricEngine
from .judging_errors import MetricError

class JudgingEngine(object):
    metrics_map = {
        "accuracy": MetricEngine.calc_accuracy,
        "precision_binary": MetricEngine.calc_precision_binary,
        "recall_binary": MetricEngine.calc_recall_binary,
        "f1_binary": MetricEngine.calc_f1_binary
    }

    def judge(self, predicted, truth, metric):
        if metric not in JudgingEngine.metrics_map:
            raise MetricError("Metric not found in Metric Engine")
        metric_func = JudgingEngine.metrics_map[metric]
        return metric_func(predicted, truth)

        