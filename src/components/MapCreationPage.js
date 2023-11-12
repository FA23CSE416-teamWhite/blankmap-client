import React, { useState } from "react";

const MapCreationPage = () => {
  // State for form inputs
  const [mapName, setMapName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleStartWithBlank = () => {
    // Logic to handle starting with a blank map
    console.log("Start with Blank Map");
  };

  const handleLoadFromMap = () => {
    // Logic to handle loading from an existing map
    console.log("Load from Map");
  };

  const handleCategoryChange = (event) => {
    // Update the selected category when the user chooses from the dropdown
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="map-creation-page">
      <div className="left-section">
        <h2>Name of the map:</h2>
        <form>
          <label>
            Name:
            <input
              type="text"
              value={mapName}
              onChange={(e) => setMapName(e.target.value)}
            />
          </label>
          <label>
            Public:
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            Tags:
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </label>
        </form>
      </div>

      <div className="right-section">
        <h2>Your Map: </h2>
        <label>
            Choose a Category:
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">-- Select --</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              {/* Add more categories as needed */}
            </select>
          </label>
        <button onClick={handleStartWithBlank}>Start with Blank</button>
        <button onClick={handleLoadFromMap}>Load from Map</button>
      </div>
    </div>
  );
};

export default MapCreationPage;