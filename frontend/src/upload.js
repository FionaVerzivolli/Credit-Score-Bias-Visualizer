
function Upload() {
    return (
      <div className="App">

        <main id="main-content">
            {/* Dataset Requirement Section*/}
            <section className="data-instructions">
            <h2>Dataset Requirements</h2>
            <p>Please ensure your dataset has the following attributes:</p>
            <table className="attribute-table">
              <thead>
                <tr>
                  <th>user_id</th>
                  <th>age</th>
                  <th>race</th>
                  <th>continent</th>
                  <th>gender</th>
                  <th>economic_situation</th>
                  <th>credit_score</th>
                  <th>defaulted</th>
                </tr>
              </thead>
              <thead>
                <tr>
                  <th>int</th>
                  <th>int</th>
                  <th>string</th>
                  <th>string</th>
                  <th>string</th>
                  <th>double</th>
                  <th>int</th>
                  <th>bool</th>
                </tr>
              </thead>
            </table>
          </section>
          <section className="data-instructions">
        {/* Dataset Instruction Section*/}
        <h2>Dataset Instructions</h2>
        <p>Please ensure your dataset follows these guidelines:</p>
        <ul className="instructions-list">
          <li>Race should be one of the following: <strong>"white", "black", "asian", "hispanic", or "other"</strong>.</li>
          <li>Gender should be <strong>"male", "female", or "other"</strong>.</li>
          <li>Economic situation should be a number between <strong>1.0 and 10.0</strong>.</li>
          <li>Credit score should be an integer between <strong>300 and 850</strong>.</li>
          <li>Defaulted should be <strong>true</strong> or <strong>false</strong>.</li>
          <li>Continent should be <strong>"north america", "south america", "africa", "europe", "asia", or "oceania"</strong>.</li>
        </ul>
      </section>
      <section className="data-upload">
            <h2>Upload Dataset</h2>
            <p>Upload your dataset in JSON format to analyze bias.</p>
            <input type="file" accept=".json" />
            <button>Upload</button>
          </section>
          {/* Metrics Visualization Section */}
          <section className="metrics">
            <h2>Bias Metrics</h2>
            <p>View calculated metrics such as False Positive Rate, Demographic Parity, and Group Disparity.</p>
            <div className="metrics-display">
              <div className="metric">
                <h3>False Positive Rate</h3>
                <p>0.25</p>
              </div>
              <div className="metric">
                <h3>Demographic Parity</h3>
                <p>0.85</p>
              </div>
              <div className="metric">
                <h3>Group Disparity</h3>
                <p>0.9</p>
              </div>
            </div>
          </section>
  
          {/* Results Section */}
          <section className="results animate-fade-in">
            <h2>Analysis Results</h2>
            <p>Based on the uploaded data, here's the overall bias evaluation:</p>
            <div className="results-summary animate-zoom-in">
              <h3>Overall Grade: B</h3>
            </div>
          </section>
        </main>
        <footer className="animate-fade-in">
          <p>&copy; 2025 Bias Visualizer Project</p>
        </footer>
      </div>
    );
  }

  export default Upload;