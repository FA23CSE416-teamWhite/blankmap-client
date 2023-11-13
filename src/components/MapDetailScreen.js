import React from "react";

const MapDetailScreen = ({ mapDetails }) => {
  const { description, tags, mapImage, comments } = mapDetails;

  return (
    <div className="map-detail-screen">
      <div className="left-side">
        <div className="description-box">
          <h2>Description</h2>
          <p>{description}</p>
        </div>

        <div className="tags-box">
          <h2>Tags</h2>
          <div className="tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="buttons">
          <button onClick={() => console.log("Button 1 clicked")}>Open Edit As My Map</button>
          <button onClick={() => console.log("Button 2 clicked")}>Export Data</button>
        </div>
      </div>

      <div className="right-side">
        <div className="map-image">
          <img src={mapImage} alt="Map" />
        </div>

        <div className="comment-box">
          <h2>Comments</h2>
          <ul>
            {comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MapDetailScreen;