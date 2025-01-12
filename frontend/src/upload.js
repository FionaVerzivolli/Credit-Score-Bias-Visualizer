import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Upload() {
  const [file, setFile] = useState(null);
  const [filters, setFilters] = useState({
    gender: "",
    continent: "",
    ageGroup: "",
  }); // State to manage multiple filters
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
      setMetrics({
        falsePositiveRate: 0.25,
        demographicParity: 0.85,
        groupDisparity: 0.9,
      });
      setOverallGrade("B");
    } else {
      alert("Please upload a file.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterClick = () => {
    const { gender, continent, ageGroup } = filters;
    if (!gender && !continent && !ageGroup) {
      alert("Please select at least one filter option.");
    } else {
      console.log(`Filtering dataset with filters:`, filters);
      // Add filtering logic here
    }
  };

  return (
    <div className="App">
      {/* Home Button */}
      <div className="home-button">
        <Link to="/" className="home-link">
          Home
        </Link>
      </div>

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
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            aria-label="Dataset file input"
          />
          <button onClick={handleUpload}>Upload</button>
        </section>

        <section className="filter-section">
  <h2>Filter Dataset</h2>
  <p>Select attributes to filter the dataset:</p>

  {/* Grid Layout for Filters */}
  <div className="filter-grid">
    {/* Race Filter */}
    <div>
      <select
        id="race-filter"
        name="race"
        value={filters.race}
        onChange={handleFilterChange}
        aria-label="Filter by race"
      >
        <option value="">-- Race --</option>
        <option value="white">White</option>
        <option value="black">Black</option>
        <option value="asian">Asian</option>
        <option value="hispanic">Hispanic</option>
        <option value="other">Other</option>
      </select>
    </div>

    {/* Gender Filter */}
    <div>
      <select
        id="gender-filter"
        name="gender"
        value={filters.gender}
        onChange={handleFilterChange}
        aria-label="Filter by gender"
      >
        <option value="">-- Gender --</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>

    {/* Continent Filter */}
    <div>
      <select
        id="continent-filter"
        name="continent"
        value={filters.continent}
        onChange={handleFilterChange}
        aria-label="Filter by continent"
      >
        <option value="">-- Continent --</option>
        <option value="asia">Asia</option>
        <option value="europe">Europe</option>
        <option value="north-america">North America</option>
        <option value="south-america">South America</option>
        <option value="africa">Africa</option>
        <option value="oceania">Oceania</option>
      </select>
    </div>

    {/* Age Group Filter */}
    <div>
      <select
        id="age-filter"
        name="ageGroup"
        value={filters.ageGroup}
        onChange={handleFilterChange}
        aria-label="Filter by age group"
      >
        <option value="">-- Age --</option>
        <option value="child">Child</option>
        <option value="teen">Teen</option>
        <option value="adult">Adult</option>
        <option value="senior">Senior</option>
      </select>
    </div>
  </div>

  {/* Apply Filters Button */}
  <button onClick={handleFilterClick} className="filter-button">
    Apply Filters
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
