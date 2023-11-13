import React, { useEffect, useState } from "react";

const MapEdit = () => {

  const [features, setFeatures] = useState([]);

  const [selectedFeatureType, setSelectedFeatureType] = useState("");
  const [featureName, setFeatureName] = useState("");
  useEffect(() => {
    setFeatures([
        { type: "String", name: "Name" },
        { type: "Number", name: "Population" },
        { type: "Number", name: "Area" },
        { type: "Number", name: "GDP" },
        { type: "Number", name: "HDI" },
    ]);
    }, []);

  const handleAddFeature = () => {
    if (selectedFeatureType && featureName) {

      setFeatures([...features, { type: selectedFeatureType, name: featureName }]);

      setSelectedFeatureType("");
      setFeatureName("");
    }
  };


  const handleEditFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };


  const handleRenderChoropleth = () => {

    console.log("Rendering as choropleth map...");
  };


  const handleRankFeatures = () => {

    console.log("Ranking features...");
  };

  return (
    <div className="map-edit-page">
      <div className="left-section">

        <h2>Title</h2>
        <img src="map-image.jpg" alt="Map" className="map-image" />

        <button>Add a new region</button>
      </div>

      <div className="right-section">

        <h3>Category Name</h3>

        <button>&lt; Backward</button>
        <button>Forward &gt;</button>


        <div className="feature-list">
          <h3>Features</h3>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>
                {feature.name} ({feature.type}){" "}
                <button onClick={() => handleEditFeature(index)}>Edit</button>
              </li>
            ))}
          </ul>
        </div>


        <div className="add-feature">
          <h3>Add Feature</h3>

          <select
            value={selectedFeatureType}
            onChange={(e) => setSelectedFeatureType(e.target.value)}
          >
            <option value="">Select Feature Type</option>
            <option value="String">String</option>
            <option value="Number">Number</option>
          </select>

          <input
            type="text"
            placeholder="Feature Name"
            value={featureName}
            onChange={(e) => setFeatureName(e.target.value)}
          />

          <button onClick={handleAddFeature}>Add</button>
        </div>


        <button onClick={handleAddFeature}>Add More Features</button>


        <div className="choropleth-options">
          <h3>Choropleth Options</h3>

          <select
            value={selectedFeatureType}
            onChange={(e) => setSelectedFeatureType(e.target.value)}
          >
            <option value="">Feature for Choropleth </option>
            <option value="Name">String</option>
            <option value="Population">Number</option>
            <option value="Area">Number</option>
            <option value="GDP">Number</option>
            <option value="HDI">Number</option>
          </select>

          <div className="color-boxes">
            <div className="color-box" style={{ backgroundColor: "red" }}></div>
            <div className="color-box" style={{ backgroundColor: "orange" }}></div>
            <div className="color-box" style={{ backgroundColor: "yellow" }}></div>
            <div className="color-box" style={{ backgroundColor: "green" }}></div>
            <div className="color-box" style={{ backgroundColor: "blue" }}></div>
          </div>

          <button onClick={handleRankFeatures}>Rank it</button>
          <button onClick={handleRenderChoropleth}>Render as Choropleth Map</button>
        </div>
      </div>
    </div>
  );
};

export default MapEdit;