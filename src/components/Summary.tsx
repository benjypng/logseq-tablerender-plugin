import { SummaryProps } from "./types";

export const Summary = ({ results }: SummaryProps) => {
  logseq.provideStyle(`
    .summary {
        border: 2px solid;
        display: flex;
        flex-direction: row;
        padding: 3px;
        border-radius: 8px;
        gap: 2px;
        font-size: 90%;
    }

    .result-card {
        text-align: center;
        padding: 3px 2px;
        border: 1px solid;
        width: 100%;
    }

    .result-card > p {
        margin: 2px;
    }

    .description {
        font-style: italic;
    }
	`);

  const { average, sum, median, mode, variance, sd, ssd, percentile } = results;

  return (
    <>
      {Object.keys(results).length !== 0 && (
        <div className="summary">
          {average && (
            <div className="result-card">
              <b>AVERAGE</b>
              <p className="description">{average.description}</p>
              <p>{average.value.toFixed(4)}</p>
            </div>
          )}

          {sum && (
            <div className="result-card">
              <b>SUM</b>
              <p className="description">{sum.description}</p>
              <p>{sum.value.toFixed(4)}</p>
            </div>
          )}

          {median && (
            <div className="result-card">
              <b>MEDIAN</b>
              <p className="description">{median.description}</p>
              <p>{median.value.toFixed(4)}</p>
            </div>
          )}

          {mode && (
            <div className="result-card">
              <b>MODE</b>
              <p className="description">{mode.description}</p>
              <p>{mode.value.toFixed(4)}</p>
            </div>
          )}

          {variance && (
            <div className="result-card">
              <b>VARIANCE</b>
              <p className="description">{variance.description}</p>
              <p>{variance.value.toFixed(4)}</p>
            </div>
          )}

          {sd && (
            <div className="result-card">
              <b>STANDARD DEVIATION</b>
              <p className="description">{sd.description}</p>
              <p>{sd.value.toFixed(4)}</p>
            </div>
          )}

          {ssd && (
            <div className="result-card">
              <b>SAMPLE STANDARD DEVIATION</b>
              <p className="description">{ssd.description}</p>
              <p>{ssd.value.toFixed(4)}</p>
            </div>
          )}

          {percentile && (
            <div className="result-card">
              <b>PERCENTILE</b>
              <p className="description">{percentile.description}</p>
              <p>{percentile.value.toFixed(4)}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};
