import { MathResults } from "~/libs/types";

export const Summary = ({ results }: { results: MathResults[] }) => {
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

  if (results.length === 0) return null;

  return (
    <div className="summary">
      {results.map((result) => {
        switch (result.type) {
          case "average":
            return (
              <div className="result-card">
                <b>AVERAGE</b>
                <p className="description">{result.description}</p>
                <p>{result.value.toFixed(4)}</p>
              </div>
            );
          case "sum":
            return (
              <div className="result-card">
                <b>SUM</b>
                <p className="description">{result.description}</p>
                <p>{result.value.toFixed(4)}</p>
              </div>
            );
          case "median":
            return (
              <div className="result-card">
                <b>MEDIAN</b>
                <p className="description">{result.description}</p>
                <p>{result.value.toFixed(4)}</p>
              </div>
            );
          case "mode":
            return (
              <div className="result-card">
                <b>MODE</b>
                <p className="description">{result.description}</p>
                <p>{result.value.toFixed(4)}</p>
              </div>
            );
          case "variance":
            return (
              <div className="result-card">
                <b>VARIANCE</b>
                <p className="description">{result.description}</p>
                <p>{result.value.toFixed(4)}</p>
              </div>
            );
          case "sd":
            return (
              <div className="result-card">
                <b>STANDARD DEVIATION</b>
                <p className="description">{result.description}</p>
                <p>{result.value.toFixed(4)}</p>
              </div>
            );
          case "ssd":
            return (
              <div className="result-card">
                <b>SAMPLE STANDARD DEVIATION</b>
                <p className="description">{result.description}</p>
                <p>{result.value.toFixed(4)}</p>
              </div>
            );
          case "percentile":
            return (
              <div className="result-card">
                <b>PERCENTILE</b>
                <p className="description">{result.description}</p>
                <p>{result.value.toFixed(4)}</p>
              </div>
            );
          default:
            return (
              <div className="result-card">
                <b>No data found</b>
              </div>
            );
        }
      })}
    </div>
  );
};
