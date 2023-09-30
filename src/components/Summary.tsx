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
	`);
  const { average, sum, median, mode } = results;
  return (
    <div className="summary">
      {average && (
        <div className="result-card">
          <b>AVERAGE</b>
          <p>{average.description}</p>
          <p>{average.value}</p>
        </div>
      )}

      {sum && (
        <div className="result-card">
          <b>SUM</b>
          <p>{sum.description}</p>
          <p>{sum.value}</p>
        </div>
      )}

      {median && (
        <div className="result-card">
          <b>MEDIAN</b>
          <p>{median.description}</p>
          <p>{median.value}</p>
        </div>
      )}

      {mode && (
        <div className="result-card">
          <b>MODE</b>
          <p>{mode.description}</p>
          <p>{mode.value}</p>
        </div>
      )}
    </div>
  );
};
