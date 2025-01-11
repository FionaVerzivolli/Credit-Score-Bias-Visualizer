import './App.css';

function App() {
  return (
    <div className="App">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="title">Bias Analysis in Credit Score</h1>
          <p>Explore potential biases and evaluate fairness metrics.</p>
          <a href="#main-content" className="scroll-down">Visualize</a>
        </div>
      </section>

      <main id="main-content">

        {/* Data Upload Section */}
        <section className="data-upload animate-slide-in">
          <h2>Upload Dataset</h2>
          <p>Upload your dataset in JSON format to analyze bias.</p>
          <input type="file" accept=".json" />
          <button>Upload</button>
        </section>

        {/* Metrics Visualization Section */}
        <section className="metrics animate-slide-in">
          <h2>Bias Metrics</h2>
          <p>View calculated metrics such as False Positive Rate, Demographic Parity, and Group Disparity.</p>
          <div className="metrics-display">
            <div className="metric animate-fade-in-delayed">
              <h3>False Positive Rate</h3>
              <p>0.25</p>
            </div>
            <div className="metric animate-fade-in-delayed">
              <h3>Demographic Parity</h3>
              <p>0.85</p>
            </div>
            <div className="metric animate-fade-in-delayed">
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

export default App;
