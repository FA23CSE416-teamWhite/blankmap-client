import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import MapOverview from "./MapOverview";
import SearchBar from "./SearchBar";
import { Button, Card, CardContent} from "@mui/material";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import temp_map from './images/temp_map.png';
import NavBar from "./NavBar";
import Typography from '@mui/material/Typography';

const MyMapScreen = ({ userMaps }) => {
  const [mapFilter, setMapFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const mapList = [
    {
      title: "Cat's Masterpiece",
      description: "Through the combined knowledge of all the felines in the world, we have created a masterpiece for the public",
      author: "Cat",
      tags: ["tag1", "tag2", "tag3"],
      mapSnapshot: temp_map,
      createdDate: "10/25/2015",
    },
    {
      title: "Dog is better",
      description: "Dogs > Cats Ratio",
      author: "Dog",
      tags: ["tag4", "tag5", "tag6"],
      mapSnapshot: temp_map,
      createdDate: "12/12/2002",
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
    <Box sx={{ display: 'flex', padding: '20px' }}>
    <ProfileMenu />

    <Box sx={{ marginLeft: '225px', width: '100%' }}>
    <Typography variant="h4" gutterBottom>
          My Maps
        </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        {/* Filter Switch */}
        <div className="filter-switch" style={{ display: 'flex', marginBottom: '10px' }}>
          <label>
            <input
              type="radio"
              value="all"
              checked={mapFilter === 'all'}
              onChange={() => setMapFilter('all')}
            />
            All
          </label>

          <label>
            <input
              type="radio"
              value="public"
              checked={mapFilter === 'public'}
              onChange={() => setMapFilter('public')}
            />
            Public
          </label>

          <label>
            <input
              type="radio"
              value="private"
              checked={mapFilter === 'private'}
              onChange={() => setMapFilter('private')}
            />
            Private
          </label>
        </div>

        {/* Search Bar */}
        <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '10px' }}
          />

        {/* Create Map Button */}
        <Button variant="contained" onClick={() => navigate('/create')} style={{ marginBottom: '20px' }}>
          Create Map
        </Button>
      </Box>

      {/* Map Overviews */}
      <div className="map-overviews">
        {filteredMaps.map((mapInfo, index) => (
          <Card key={index} style={{ marginBottom: '25px', backgroundColor: 'aliceblue', marginTop: '15px'}}>
            <CardContent>
              <MapOverview mapInfo={mapInfo} />
              <Box sx={{justifyContent: 'right',}}>
                <Button 
                  // onClick={()} for future purposes
                  sx={{
                    fontSize: '10px',
                    backgroundColor: 'red',
                    color: 'white',
                    padding: '5px',
                    borderRadius: '4px', // Set border-radius for rounded corners
                    margin: '0 4px',
                }}>Delete
                </Button>
              </Box>
              
            </CardContent>
          </Card>
        ))}
      </div>
    </Box>
  </Box>
  );
};

export default MyMapScreen;