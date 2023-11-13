import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import MapOverview from "./MapOverview";
import SearchBar from "./SearchBar";
import { Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import temp_map from './images/temp_map.png';
import NavBar from "./NavBar";

const MyMapScreen = ({ userMaps }) => {
  const [mapFilter, setMapFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const mapList = [
    {
      title: "Map 1",
      description: "Description for Map 1",
      author: "Author 1",
      tags: ["tag1", "tag2", "tag3"],
      mapSnapshot: temp_map,
    },
    {
      title: "Map 2",
      description: "Description for Map 2",
      author: "Author 2",
      tags: ["tag4", "tag5", "tag6"],
      mapSnapshot: temp_map,
    },
    // Add more map information objects as needed
  ];
  const filteredMaps = mapList;
  const navigate = useNavigate();
  // const filteredMaps = userMaps.filter((map) => {
  //   // Apply filtering logic based on mapFilter and searchTerm
  //   if (mapFilter === "public" && !map.isPublic) {
  //     return false;
  //   }
  //   if (mapFilter === "private" && map.isPublic) {
  //     return false;
  //   }
  //   if (searchTerm && !map.title.toLowerCase().includes(searchTerm.toLowerCase())) {
  //     return false;
  //   }
  //   return true;
  // });

  return (
    <div className="profile-page" style={{ display: 'flex',padding:"20px"}}>
      <NavBar />
      <ProfileMenu />
      <div className="content-container" style={{ marginLeft: '500px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Filter Switch */}
          <div className="filter-switch" style={{ display: 'flex', marginBottom: '10px' }}>
            <label>
              <input
                type="radio"
                value="all"
                checked={mapFilter === "all"}
                onChange={() => setMapFilter("all")}
              />
              All
            </label>

            <label>
              <input
                type="radio"
                value="public"
                checked={mapFilter === "public"}
                onChange={() => setMapFilter("public")}
              />
              Public
            </label>

            <label>
              <input
                type="radio"
                value="private"
                checked={mapFilter === "private"}
                onChange={() => setMapFilter("private")}
              />
              Private
            </label>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={setSearchTerm} style={{ marginBottom: '10px' }} />

          {/* Create Map Button */}
          <Button variant="contained" onClick={() => navigate("/create")} style={{ marginBottom: '20px' }}>
            Create Map
          </Button>
        </Box>
        {/* Map Overviews */}
        <div className="map-overviews">
            {filteredMaps.map((mapInfo, index) => (
              <Card key={index} style={{ marginBottom: '20px' }}>
                <CardContent>
                  <MapOverview mapInfo={mapInfo} />
                </CardContent>
              </Card>
            ))}
          </div>

      </div>
    </div>
  );
};

export default MyMapScreen;