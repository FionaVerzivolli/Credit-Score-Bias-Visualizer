import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./App.css";
import { getWebSocket } from "./utils/websocket";
import ChartComponent from "./ChartComponent"; // Import ChartComponent



function Upload() {
  const { user } = useAuth0();
  const [file, setFile] = useState(null);
  const [webSocket, setWebSocket] = useState(null);
  const [chartKey, setChartKey] = useState(0); // Unique key for ChartComponent
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

  const [snapshotName, setSnapshotName] = useState("");

  const handleSaveSnapshot = () => {
    if (!snapshotName.trim()) {
      alert("Please provide a valid snapshot name.");
      return;
    }
  
    // Prepare the snapshot data
    const snapshot = {
      snapshotName: snapshotName, // Pass the snapshot name from the input field
      userId: user?.sub,  // Include the user ID from Auth0
      filters: filters,   // Send the currently applied filters
      metrics: metrics,   // Include the bias metrics
      overallGrade: overallGrade, // Include the overall grade
    };
    console.log(snapshot);
    // Make the POST request to the save_snapshot_api
    fetch("https://andrewsasmito05.pythonanywhere.com/save_snapshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snapshot),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Snapshot saved successfully:", data);
        alert(`Snapshot "${snapshotName}" saved successfully!`);
        setSnapshotName(""); // Reset the input field
      })
      .catch((error) => {
        console.error("Error saving snapshot:", error);
        alert("Failed to save snapshot. Please try again.");
      });
  };
  
  


  const { logout } = useAuth0();

  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = JSON.parse(e.target.result);
          setFileContent(content); // Store parsed JSON in state
        } catch (error) {
          alert("Invalid JSON file.");
          setFileContent(null);
        }
      };
      reader.readAsText(selectedFile);
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
            userId: user?.sub, // Include user.sub in the payload
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
    if (!fileContent) {
      alert("No valid file content found. Please upload a valid JSON file.");
      return;
    }
  
    const { gender, continent, ageGroup, race } = filters;
    if (!gender && !continent && !ageGroup && !race) {
      alert("Please select at least one filter option.");
      return;
    }
  
    const payload = {
      filters: { gender, continent, ageGroup, race },
      fileContent, // Use parsed content from state
      userId: user?.sub, // Include user.sub in the payload
    };
  
    fetch("https://andrewsasmito05.pythonanywhere.com/api/filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const { snapshot } = data;
        console.log(snapshot);
        setMetrics({
          falsePositiveRate: snapshot.metrics.falsePositiveRate,
          demographicParity: snapshot.metrics.demographicParity,
          groupDisparity: snapshot.metrics.groupDisparity,
        });
        setOverallGrade(snapshot.overallGrade);
        setChartKey((prevKey) => prevKey + 1); // Increment chartKey to force ChartComponent re-render
        alert("Filters applied successfully!");
      })
      .catch((error) => {
        console.error("Error applying filters:", error);
        alert("Failed to apply filters. Please try again.");
      });
  };
  
  return (
    <div className="App4">
      {/* Home and Log Out Buttons */}
      <div className="static-buttons-container">
        <Link to="/home" className="button-link2">
          Home
        </Link>
        <Link to="/instructions" className="button-link2">
          Instructions
        </Link>
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="button-link2"
        >
          Log Out
        </button>
      </div>

      <main id="main-content">
        {/* Upload Section */}

        <section className="data-upload">
          <h2>Upload Dataset in JSON Format</h2>
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
          <section className="metrics">
  <h2>Bias Metrics</h2>
  <div className="containers">
  <div className="metrics-display">
    <div>False Positive Rate: {metrics.falsePositiveRate || "N/A"}</div>
    <div>Demographic Parity: {metrics.demographicParity || "N/A"}</div>
    <div>Group Disparity: {metrics.groupDisparity || "N/A"}</div>
    <div>Overall Grade: {overallGrade || "N/A"}</div>
      </div>
    <div className="chart-display">
    <ChartComponent key={chartKey} filtered_data={[
    metrics.falsePositiveRate || 0,
    metrics.demographicParity || 0,
    metrics.groupDisparity || 0,
  ]}/>
  </div>
  </div>
    </section>
    
  
  
  <section>
  <div className="save-snapshot">
    <input
      type="text"
      placeholder="Snapshot Name"
      value={snapshotName}
      onChange={(e) => setSnapshotName(e.target.value)}
      className="snapshot-input"
    />
    <button onClick={handleSaveSnapshot} className="snapshot-button">
      Save Snapshot
    </button>
  </div>
</section>
</main>

</div>
);
}

export default Upload;
