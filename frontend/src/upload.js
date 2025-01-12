import React, { useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [filter, setFilter] = useState(""); // State to manage the selected filter
  const [metrics, setMetrics] = useState({
    falsePositiveRate: null,
    demographicParity: null,
    groupDisparity: null,
  });
  const [overallGrade, setOverallGrade] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      console.log("File uploaded:", file);
      // Simulated metrics update
      setMetrics({ falsePositiveRate: 0.25, demographicParity: 0.85, groupDisparity: 0.9 });
      setOverallGrade("B");
    } else {
      alert("Please upload a file.");
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleFilterClick = () => {
    if (!filter) {
      alert("Please select an attribute to filter.");
    } else {
      console.log(`Filtering dataset by ${filter}`);
      // Add logic to filter dataset here
    }
  };

  return (
    <div className="App">
      <main id="main-content">
        <section className="data-instructions">
          <h2>Dataset Requirements</h2>
          <p>Please ensure your dataset has the following attributes:</p>
          {/* Existing table */}
        </section>
        <section className="data-upload">
          <h2>Upload Dataset</h2>
          <p>Upload your dataset in JSON format to analyze bias.</p>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            aria-label="Dataset file input"
          />
          <button onClick={handleUpload}>Upload</button>
        </section>

        {/* Dropdown Filter Section */}
        <section className="filter-section">
          <h2>Filter Dataset</h2>
          <p>Select an attribute to filter the dataset:</p>
          <label htmlFor="attribute-filter">Filter By Attribute:</label>
          <select
            id="attribute-filter"
            value={filter}
            onChange={handleFilterChange}
            aria-label="Select attribute to filter"
          >
            <option value="">-- Select Attribute --</option>
            <option value="race">Race</option>
            <option value="gender">Gender</option>
            <option value="age">Age</option>
            <option value="continent">Continent</option>
          </select>

          {/* Filter Button */}
          <button onClick={handleFilterClick} className="filter-button">
            Filter
          </button>
        </section>

        <section className="metrics">
          <h2>Bias Metrics</h2>
          <div className="metrics-display">
            <div className="metric">
              <h3>False Positive Rate</h3>
              <p>{metrics.falsePositiveRate || "N/A"}</p>
            </div>
            <div className="metric">
              <h3>Demographic Parity</h3>
              <p>{metrics.demographicParity || "N/A"}</p>
            </div>
            <div className="metric">
              <h3>Group Disparity</h3>
              <p>{metrics.groupDisparity || "N/A"}</p>
            </div>
          </div>
        </section>
        <section className="results">
          <h2>Analysis Results</h2>
          <div className="results-summary">
            <h3>Overall Grade: {overallGrade || "N/A"}</h3>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Bias Visualizer Project</p>
      </footer>
    </div>
  );
}

export default Upload;
