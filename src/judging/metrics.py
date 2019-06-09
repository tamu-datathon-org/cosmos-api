from .judging_errors import SubmissionError
from math import isclose

def verify_length(predicted, truth):
    if len(predicted) != len(truth):
        raise SubmissionError( f"Submission is of incorrect length. Should be length {len(truth)}.")

class MetricEngine(object):

    @staticmethod
    def calc_accuracy(predicted, truth):
        verify_length(predicted, truth)
        return sum([1 for p, t in zip(predicted, truth) if isclose(float(p),float(t))]) / len(truth)

    @staticmethod
    def calc_precision_binary(predicted, truth):
        verify_length(predicted, truth)
        # expects lists of just 1s and 0s
        if set(predicted) != {0, 1}:
            raise SubmissionError("Submission must contain only 0 and 1 entries.")
        true_pos = sum([1 for p, t in zip(predicted, truth) if p == 1 and t == 1])
        false_pos = sum([1 for p, t in zip(predicted, truth) if p == 1 and t == 0])
        return true_pos / (true_pos + false_pos)

    @staticmethod
    def calc_recall_binary(predicted, truth):
        verify_length(predicted, truth)
        # expects lists of just 1s and 0s
        if sorted(set(predicted)) != [0, 1]:
            raise SubmissionError("Submission must contain only 0 and 1 entries.")
        true_pos = sum([1 for p, t in zip(predicted, truth) if p == 1 and t == 1])
        false_neg = sum([1 for p, t in zip(predicted, truth) if p == 0 and t == 1])
        return true_pos / (true_pos + false_neg)

    @staticmethod
    def calc_f1_binary(predicted, truth):
        prec = calc_precision_binary(predicted, truth)
        recall = calc_recall_binary(predicted, truth)
        return 2 * ( (prec * recall) / (prec + recall) )

