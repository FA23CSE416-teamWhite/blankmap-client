import React from "react";
import Tags from "./Tags"; 

const MapOverview = ({ mapInfo }) => {
  const { title, description, author, tags, mapSnapshot, createdDate } = mapInfo;

  return (
    <div className="map-overview">
      <img src={mapSnapshot} alt="Map Snapshot" className="map-snapshot" />

      <div className="map-details">
        <h2>{title}</h2>
        <p>{description}</p>
        <p>Created by: {author} {createdDate}</p>

        <div className="tags-section">
          <strong>Tags:</strong>
          <Tags tags={tags} />
        </div>
      </div>
    </div>
  );
};

export default MapOverview;