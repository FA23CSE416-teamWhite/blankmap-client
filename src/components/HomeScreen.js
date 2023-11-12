import React, { useState } from "react";
import MapOverview from "./MapOverview";

const HomeScreen = () => {
  // Assuming you have an array of map information
  const mapList = [
    {
      title: "Map 1",
      description: "Description for Map 1",
      author: "Author 1",
      tags: ["tag1", "tag2", "tag3"],
      mapSnapshot: "url-to-map-snapshot-1.jpg",
    },
    {
      title: "Map 2",
      description: "Description for Map 2",
      author: "Author 2",
      tags: ["tag4", "tag5", "tag6"],
      mapSnapshot: "url-to-map-snapshot-2.jpg",
    },
    // Add more map information objects as needed
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [mapsPerPage] = useState(3); // Adjust the number of maps per page as needed
  const [sortOption, setSortOption] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);

  const handleCreateMap = () => {
    console.log("create map");
  }
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
  };

  // Apply sort
  const sortedMapList = [...mapList].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    }
    // Add more sorting options as needed
    return 0;
  });

  // Apply category filter
  const filteredMapList = categoryFilter
    ? sortedMapList.filter((map) => map.tags.includes(categoryFilter))
    : sortedMapList;

  const indexOfLastMap = currentPage * mapsPerPage;
  const indexOfFirstMap = indexOfLastMap - mapsPerPage;
  const currentMapList = mapList.slice(indexOfFirstMap, indexOfLastMap);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="home-screen">
      {/* <h1>Home Screen</h1> */}

      <button onClick={handleCreateMap}>Create Map</button>

      {/* Sort Options */}
      <div className="sort-options">
        <label>
          Sort By:
          <select onChange={(e) => handleSortChange(e.target.value)}>
            <option value="">-- Select --</option>
            <option value="title">Title</option>
            {/* Add more sorting options as needed */}
          </select>
        </label>
      </div>

      {/* Category Filter */}
      <div className="filter-options">
        <label>
          Filter By Category:
          <select onChange={(e) => handleCategoryFilter(e.target.value)}>
            <option value="">-- Select --</option>
            {/* Assume you have unique categories in your mapList */}
            {Array.from(new Set(mapList.flatMap((map) => map.tags))).map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="map-overviews">
        {currentMapList.map((mapInfo, index) => (
          <MapOverview key={index} mapInfo={mapInfo} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredMapList.length / mapsPerPage) }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;