import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import { getWebSocket } from "./utils/websocket";

function Upload() {
  const [file, setFile] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [isWebSocketReady, setIsWebSocketReady] = useState(false);
  const [filters, setFilters] = useState({
    gender: "",
    continent: "",
    ageGroup: "",
    race: "",
  });
  const [metrics, setMetrics] = useState({
    falsePositiveRate: null,
    demographicParity: null,
    groupDisparity: null,
  });
  const [overallGrade, setOverallGrade] = useState(null);

  useEffect(() => {
    const ws = getWebSocket();
    if (ws) {
      ws.onopen = () => {
        setIsWebSocketReady(true);
        console.log("WebSocket connection is open.");
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        alert("WebSocket connection failed. Please try again.");
      };

      ws.onclose = () => {
        setIsWebSocketReady(false);
        console.warn("WebSocket connection closed.");
      };

      setWebSocket(ws);
    }
  }, []);

  const { logout } = useAuth0();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/json") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid JSON file.");
      setFile(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("No file selected. Please upload a file.");
      return;
    }

    if (!isWebSocketReady || !webSocket) {
      alert("WebSocket connection is not ready. Please try again.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;

      console.log("File Name:", file.name);
      console.log("File Content:", fileContent);

      try {
        console.log("Sending file content to the server...");
        webSocket.send(
          JSON.stringify({
            fileName: file.name,
            content: fileContent,
          })
        );

        alert("File uploaded successfully!");

        // Simulate receiving metrics and grade
        setMetrics({
          falsePositiveRate: 0.25,
          demographicParity: 0.85,
          groupDisparity: 0.9,
        });
        setOverallGrade("B");
      } catch (error) {
        console.error("Error sending file over WebSocket:", error);
        alert("Failed to upload the file.");
      }
    };

    reader.onerror = () => {
      console.error("Error reading file.");
      alert("Failed to read the file. Please try again.");
    };

    reader.readAsText(file);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterClick = () => {
    const { gender, continent, ageGroup, race } = filters;
  
    if (!file) {
      alert("Please upload a JSON file before applying filters.");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
  
      if (!gender && !continent && !ageGroup && !race) {
        alert("Please select at least one filter option.");
        return;
      }
  
      const payload = {
        filters: {
          gender,
          continent,
          ageGroup,
          race,
        },
        fileContent: JSON.parse(fileContent), // Parse the file content as JSON
      };
  
      // Send the payload to the Flask backend
      fetch("http://127.0.0.1:5000/api/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Filtered data from backend:", data);
  
          // Extract metrics and overall grade from the response
          const { snapshot } = data;
  
          setMetrics({
            falsePositiveRate: snapshot.metrics.falsePositiveRate,
            demographicParity: snapshot.metrics.demographicParity,
            groupDisparity: snapshot.metrics.groupDisparity,
          });
          setOverallGrade(snapshot.overallGrade);
  
          alert("Filters applied successfully!");
        })
        .catch((error) => {
          console.error("Error applying filters:", error);
          alert("Failed to apply filters. Please try again.");
        });
    };
  
    reader.onerror = () => {
      console.error("Error reading file.");
      alert("Failed to read the file. Please try again.");
    };
  
    reader.readAsText(file); // Read the file content
  };
  
  

  return (
    <div className="App">
      {/* Home and Log Out Buttons */}
      <div className="static-buttons-container">
        <Link to="/home" className="button-link">
          Home
        </Link>
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="button-link"
        >
          Log Out
        </button>
      </div>

      <main id="main-content">
        {/* Dataset Requirement Section */}
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
          <h2>Dataset Instructions</h2>
          <p>Please ensure your dataset follows these guidelines:</p>
          <ul className="instructions-list">
            <li>
              Race should be one of the following:{" "}
              <strong>"white", "black", "asian", "hispanic", or "other"</strong>.
            </li>
            <li>
              Gender should be <strong>"male", "female", or "other"</strong>.
            </li>
            <li>
              Economic situation should be a number between{" "}
              <strong>1.0 and 10.0</strong>.
            </li>
            <li>
              Credit score should be an integer between{" "}
              <strong>300 and 850</strong>.
            </li>
            <li>
              Defaulted should be <strong>true</strong> or <strong>false</strong>
              .
            </li>
            <li>
              Continent should be{" "}
              <strong>
                "north america", "south america", "africa", "europe", "asia", or
                "oceania"
              </strong>
              .
            </li>
          </ul>
        </section>

        {/* Dataset Instructions */}
        <section className="data-instructions">
          <h2>Dataset Instructions</h2>
          <ul className="instructions-list">
            <li>
              Race should be one of: <strong>"white", "black", "asian", "hispanic", "other"</strong>.
            </li>
            <li>
              Gender should be <strong>"male", "female", "other"</strong>.
            </li>
            <li>
              Economic situation should be a number between <strong>1.0 and 10.0</strong>.
            </li>
            <li>
              Credit score should be an integer between <strong>300 and 850</strong>.
            </li>
            <li>
              Defaulted should be <strong>true</strong> or <strong>false</strong>.
            </li>
            <li>
              Continent should be <strong>"north america", "south america", "africa", "europe", "asia", or "oceania"</strong>.
            </li>
          </ul>
        </section>

        {/* Upload Section */}

        <section className="data-upload">
          <h2>Upload Dataset in JSON</h2>
          <input type="file" accept=".json" onChange={handleFileChange} />
        </section>

        {/* Filter Section */}
        <section className="filter-section">
          <h2>Filter Dataset</h2>
          <p>Select attributes to filter the dataset:</p>

          <div className="filter-grid">
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
                <option value="other">Other</option>
              </select>
            </div>

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

          <button onClick={handleFilterClick} className="filter-button">
            Apply Filters
          </button>
          </section>
        {/* Metrics Section */}
        <section className="metrics">
          <h2>Bias Metrics</h2>
          <div className="metrics-display">
            <div>False Positive Rate: {metrics.falsePositiveRate || "N/A"}</div>
            <div>Demographic Parity: {metrics.demographicParity || "N/A"}</div>
            <div>Group Disparity: {metrics.groupDisparity || "N/A"}</div>
          </div>
        </section>

        {/* Results Section */}
        <section className="results">
          <h2>Analysis Results</h2>
          <h3>Overall Grade: {overallGrade || "N/A"}</h3>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 Bias Visualizer Project</p>
      </footer>
    </div>
  );
}

export default Upload;
