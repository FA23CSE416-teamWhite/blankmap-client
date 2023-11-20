import React, { useState } from "react";
import MapOverview from "./MapOverview";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { Button, Card, CardContent } from "@mui/material";
import TextField from "@mui/material/TextField";
import temp_map from './images/temp_map.png';
import Autocomplete from '@mui/material/Autocomplete';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
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
    {
      title: "Bird's Eye View",
      description: "Explore the world from above with our bird's eye view map",
      author: "BirdWatcher",
      tags: ["bird", "aerial", "landscape"],
      mapSnapshot: temp_map,
      createdDate: "05/08/2018",
    },
    {
      title: "Underwater Wonderland",
      description: "Discover the wonders of the ocean depths in this underwater map",
      author: "OceanExplorer",
      tags: ["underwater", "marine", "coral"],
      mapSnapshot: temp_map,
      createdDate: "08/17/2021",
    },
    {
      title: "Space Odyssey",
      description: "Embark on a cosmic journey with this space-themed map",
      author: "GalaxyExplorer",
      tags: ["space", "galaxy", "astronomy"],
      mapSnapshot: temp_map,
      createdDate: "03/02/2019",
    },
    {
      title: "Historical Heritage",
      description: "Explore the historical heritage of ancient civilizations in this map",
      author: "HistoryBuff",
      tags: ["history", "ancient", "heritage"],
      mapSnapshot: temp_map,
      createdDate: "06/14/2005",
    },
    {
      title: "Fantasy Kingdom",
      description: "Immerse yourself in a fantastical realm with this fantasy-themed map",
      author: "FantasyEnthusiast",
      tags: ["fantasy", "magic", "kingdom"],
      mapSnapshot: temp_map,
      createdDate: "09/30/2017",
    },
    {
      title: "Mountain Trek",
      description: "Embark on a challenging trek through breathtaking mountain landscapes",
      author: "MountainExplorer",
      tags: ["mountain", "hiking", "adventure"],
      mapSnapshot: temp_map,
      createdDate: "07/08/2014",
    },
    {
      title: "City Lights",
      description: "Experience the vibrant city life with this city lights map",
      author: "UrbanExplorer",
      tags: ["city", "urban", "nightlife"],
      mapSnapshot: temp_map,
      createdDate: "11/19/2019",
    },
    {
      title: "Enchanted Forest",
      description: "Get lost in the magic of an enchanted forest with this mystical map",
      author: "NatureLover",
      tags: ["forest", "nature", "enchanted"],
      mapSnapshot: temp_map,
      createdDate: "04/27/2016",
    },
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
    {
      title: "Bird's Eye View",
      description: "Explore the world from above with our bird's eye view map",
      author: "BirdWatcher",
      tags: ["bird", "aerial", "landscape"],
      mapSnapshot: temp_map,
      createdDate: "05/08/2018",
    },
    {
      title: "Underwater Wonderland",
      description: "Discover the wonders of the ocean depths in this underwater map",
      author: "OceanExplorer",
      tags: ["underwater", "marine", "coral"],
      mapSnapshot: temp_map,
      createdDate: "08/17/2021",
    },
    {
      title: "Space Odyssey",
      description: "Embark on a cosmic journey with this space-themed map",
      author: "GalaxyExplorer",
      tags: ["space", "galaxy", "astronomy"],
      mapSnapshot: temp_map,
      createdDate: "03/02/2019",
    },
    {
      title: "Historical Heritage",
      description: "Explore the historical heritage of ancient civilizations in this map",
      author: "HistoryBuff",
      tags: ["history", "ancient", "heritage"],
      mapSnapshot: temp_map,
      createdDate: "06/14/2005",
    },
    {
      title: "Fantasy Kingdom",
      description: "Immerse yourself in a fantastical realm with this fantasy-themed map",
      author: "FantasyEnthusiast",
      tags: ["fantasy", "magic", "kingdom"],
      mapSnapshot: temp_map,
      createdDate: "09/30/2017",
    },
    {
      title: "Mountain Trek",
      description: "Embark on a challenging trek through breathtaking mountain landscapes",
      author: "MountainExplorer",
      tags: ["mountain", "hiking", "adventure"],
      mapSnapshot: temp_map,
      createdDate: "07/08/2014",
    },
    {
      title: "City Lights",
      description: "Experience the vibrant city life with this city lights map",
      author: "UrbanExplorer",
      tags: ["city", "urban", "nightlife"],
      mapSnapshot: temp_map,
      createdDate: "11/19/2019",
    },
    {
      title: "Enchanted Forest",
      description: "Get lost in the magic of an enchanted forest with this mystical map",
      author: "NatureLover",
      tags: ["forest", "nature", "enchanted"],
      mapSnapshot: temp_map,
      createdDate: "04/27/2016",
    },
    // ... add more map information objects as needed
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [mapsPerPage] = useState(6); // Adjust the number of maps per page as needed
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

  const sorts = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2px', alignItems: 'center' }}>
        {/* Sort By */}
        <FormControl style={{ minWidth: '120px', marginRight: '2px' }} size="small">
          <InputLabel id="sort-label">Sort By:</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            label="Sort By"
            inputProps={{
              style: { height: '36px' },
            }}
          >
            <MenuItem value="">
              <em>-- Select --</em>
            </MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
        </FormControl>

        {/* Category */}
        <Autocomplete
          value={categoryFilter}
          onChange={(e, value) => handleCategoryFilter(value)}
          options={Array.from(new Set(mapList.flatMap((map) => map.tags)))}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Category"
              size="small"
              fullWidth
            />
          )}
          style={{ minWidth: '120px', flex: 1 }}
        />
      </div>

      {/* Typography Button on the right */}
      <Button
        variant="contained"
        onClick={handleCreateMap}
        sx={{
          borderRadius: '10px',
          backgroundColor: '#0844A4', // Replace with your desired color
          color: 'white', // Text color
        }}
      >
        Create Map
      </Button>
    </Box>
  );

  const renderMapCards = () => {
    return currentMapList.map((mapInfo, index) => (
      <MapOverview key={index} mapInfo={mapInfo} />
    ));
  };

  return (
    <div>
      <div className="home-screen" style={{ paddingTop: '20px', paddingRight: '50px', paddingBottom: '30px', paddingLeft: '50px' }}>
        {sorts}
        {renderMapCards()}
        {/* Pagination Controls */}
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Pagination
              count={Math.ceil(filteredMapList.length / mapsPerPage)}
              page={currentPage}
              variant="outlined"
              shape="rounded"
              onChange={(event, page) => handlePageChange(page)}
            />
          </Stack>
        </div>

      </div>
    </div>

  );
};

export default HomeScreen;