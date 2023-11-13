import React, { useState } from "react";
import MapOverview from "./MapOverview";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Button, Card, CardContent} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import temp_map from './images/temp_map.png'

const HomeScreen = () => {
  // Assuming you have an array of map information
  const navigate = useNavigate();
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
  const [currentPage, setCurrentPage] = useState(1);
  const [mapsPerPage] = useState(3); // Adjust the number of maps per page as needed
  const [sortOption, setSortOption] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  
  const handleCreateMap = () => {
    console.log("create map");
    navigate("/create");
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

  let sorts=
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div sx={{ display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 120, marginRight: 2  }}>
          <InputLabel id="sort-label">Sort By:</InputLabel>
          <Select labelId="sort-label" id="sort-select" onChange={(e) => handleSortChange(e.target.value)}>
            <MenuItem value="">
              <em>-- Select --</em>
            </MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Category:</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={sortOption}
            onChange={(e) => handleCategoryFilter(e.target.value)}
          >
            <MenuItem value="">
              <em>-- Select --</em>
            </MenuItem>
            {Array.from(new Set(mapList.flatMap((map) => map.tags))).map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Pagination Controls */}
      <div className="pagination" >
        {Array.from({ length: Math.ceil(filteredMapList.length / mapsPerPage) }, (_, index) => (
          <Button variant="outlined" key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </Button>
        ))}
      </div>

      {/* Typography Button on the right */}
      <Typography>
        <Button variant="contained" onClick={handleCreateMap}>Create Map</Button>
      </Typography>
    </Box> 

const renderMapCards = () => {
  return currentMapList.map((mapInfo, index) => (
    <Card key={index} style={{ marginBottom: '20px', backgroundColor: 'aliceblue', marginTop: '15px'}}>  <CardContent>
        <MapOverview mapInfo={mapInfo} />
      </CardContent>
    </Card>
  ));
};

  return (
    <div>
      <div className="home-screen" style={{ paddingTop: '20px', paddingRight: '50px', paddingBottom: '30px', paddingLeft: '50px' }}>
      {/* <h1>Home Screen</h1> */}
      
      {sorts}

      
        {/* {currentMapList.map((mapInfo, index) => (
          <MapOverview key={index} mapInfo={mapInfo} />
        ))} */}
      {renderMapCards()}


    </div>
    </div>
    
  );
};

export default HomeScreen;