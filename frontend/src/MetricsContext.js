import React, { createContext, useState } from "react";

// Create the MetricsContext
export const MetricsContext = createContext();

// Create the MetricsProvider
export const MetricsProvider = ({ children }) => {
  const [metrics, setMetrics] = useState({
    falsePositiveRate: null,
    demographicParity: null,
    groupDisparity: null,
  });
  const [overallGrade, setOverallGrade] = useState(null);

  return (
    <MetricsContext.Provider value={{ metrics, setMetrics, overallGrade, setOverallGrade }}>
      {children}
    </MetricsContext.Provider>
  );
};
