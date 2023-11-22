import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  TextField,
  Autocomplete,
  Pagination,
  Stack,
} from "@mui/material";
import MapOverview from "./MapOverview";
import temp_map from './images/temp_map.png';
const HomeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const extractSearchString = () => {
      const search = new URLSearchParams(window.location.search);
      setSearchQuery(search.get("q"));
      console.log('Search String:', searchQuery);
    };
    extractSearchString();
    return () => {
    };
  }, [location.search, searchQuery]);
  const [mapList, setMaplist] = useState( [
    {
      title: "Cat's Masterpiece",
      description: "Through the combined knowledge of all the felines in the world, we have created a masterpiece for the public",
      author: "Cat",
      tags: ["tag1", "tag2", "tag3"],
      mapSnapshot: temp_map,
      createdDate: "10/25/2015",
      upVotes: 10,
      numberOfComments: 30,
    },
    {
      title: "Dog is better",
      description: "Dogs > Cats Ratio",
      author: "Dog",
      tags: ["tag4", "tag5", "tag6"],
      mapSnapshot: temp_map,
      createdDate: "12/12/2002",
      upVotes: 9,
      numberOfComments: 27,
    },
    {
      title: "Bird's Eye View",
      description: "Explore the world from above with our bird's eye view map",
      author: "BirdWatcher",
      tags: ["bird", "aerial", "landscape"],
      mapSnapshot: temp_map,
      createdDate: "05/08/2018",
      upVotes: 9,
      numberOfComments: 33,
    },
    {
      title: "Underwater Wonderland",
      description: "Discover the wonders of the ocean depths in this underwater map",
      author: "OceanExplorer",
      tags: ["underwater", "marine", "coral"],
      mapSnapshot: temp_map,
      createdDate: "08/17/2021",
      upVotes: 10,
      numberOfComments: 45,
    },
    {
      title: "Space Odyssey",
      description: "Embark on a cosmic journey with this space-themed map",
      author: "GalaxyExplorer",
      tags: ["space", "galaxy", "astronomy"],
      mapSnapshot: temp_map,
      createdDate: "03/02/2019",
      upVotes: 13,
      numberOfComments: 23,
    },
    {
      title: "Historical Heritage",
      description: "Explore the historical heritage of ancient civilizations in this map",
      author: "HistoryBuff",
      tags: ["history", "ancient", "heritage"],
      mapSnapshot: temp_map,
      createdDate: "06/14/2005",
      upVotes: 7,
      numberOfComments: 16,
    },
    {
      title: "Fantasy Kingdom",
      description: "Immerse yourself in a fantastical realm with this fantasy-themed map",
      author: "FantasyEnthusiast",
      tags: ["fantasy", "magic", "kingdom"],
      mapSnapshot: temp_map,
      createdDate: "09/30/2017",
      upVotes: 10,
      numberOfComments: 30,
    },
    {
      title: "Mountain Trek",
      description: "Embark on a challenging trek through breathtaking mountain landscapes",
      author: "MountainExplorer",
      tags: ["mountain", "hiking", "adventure"],
      mapSnapshot: temp_map,
      createdDate: "07/08/2014",
      upVotes: 11,
      numberOfComments: 23,
    },
    {
      title: "City Lights",
      description: "Experience the vibrant city life with this city lights map",
      author: "UrbanExplorer",
      tags: ["city", "urban", "nightlife"],
      mapSnapshot: temp_map,
      createdDate: "11/19/2019",
      upVotes: 1,
      numberOfComments: 70,
    },
    {
      title: "Enchanted Forest",
      description: "Get lost in the magic of an enchanted forest with this mystical map",
      author: "NatureLover",
      tags: ["forest", "nature", "enchanted"],
      mapSnapshot: temp_map,
      createdDate: "04/27/2016",
      upVotes: 10,
      numberOfComments: 30,
    },
    {
      title: "Cat's Masterpiece",
      description: "Through the combined knowledge of all the felines in the world, we have created a masterpiece for the public",
      author: "Cat",
      tags: ["tag1", "tag2", "tag3"],
      mapSnapshot: temp_map,
      createdDate: "10/25/2015",
      upVotes: 14,
      numberOfComments: 20,
    },
    {
      title: "Dog is better",
      description: "Dogs > Cats Ratio",
      author: "Dog",
      tags: ["tag4", "tag5", "tag6"],
      mapSnapshot: temp_map,
      createdDate: "12/12/2002",
      upVotes: 12,
      numberOfComments: 24,
    },
    {
      title: "Bird's Eye View",
      description: "Explore the world from above with our bird's eye view map",
      author: "BirdWatcher",
      tags: ["bird", "aerial", "landscape"],
      mapSnapshot: temp_map,
      createdDate: "05/08/2018",
      upVotes: 10,
      numberOfComments: 27,
    },
    {
      title: "Underwater Wonderland",
      description: "Discover the wonders of the ocean depths in this underwater map",
      author: "OceanExplorer",
      tags: ["underwater", "marine", "coral"],
      mapSnapshot: temp_map,
      createdDate: "08/17/2021",
      upVotes: 10,
      numberOfComments: 30,
    },
    {
      title: "Space Odyssey",
      description: "Embark on a cosmic journey with this space-themed map",
      author: "GalaxyExplorer",
      tags: ["space", "galaxy", "astronomy"],
      mapSnapshot: temp_map,
      createdDate: "03/02/2019",
      upVotes: 10,
      numberOfComments: 30,
    },
    {
      title: "Historical Heritage",
      description: "Explore the historical heritage of ancient civilizations in this map",
      author: "HistoryBuff",
      tags: ["history", "ancient", "heritage"],
      mapSnapshot: temp_map,
      createdDate: "06/14/2005",
      upVotes: 10,
      numberOfComments: 30,
    },
    {
      title: "Fantasy Kingdom",
      description: "Immerse yourself in a fantastical realm with this fantasy-themed map",
      author: "FantasyEnthusiast",
      tags: ["fantasy", "magic", "kingdom"],
      mapSnapshot: temp_map,
      createdDate: "09/30/2017",
      upVotes: 10,
      numberOfComments: 30,
    },
    {
      title: "Mountain Trek",
      description: "Embark on a challenging trek through breathtaking mountain landscapes",
      author: "MountainExplorer",
      tags: ["mountain", "hiking", "adventure"],
      mapSnapshot: temp_map,
      createdDate: "07/08/2014",
      upVotes: 10,
      numberOfComments: 30,
    },
    {
      title: "City Lights",
      description: "Experience the vibrant city life with this city lights map",
      author: "UrbanExplorer",
      tags: ["city", "urban", "nightlife"],
      mapSnapshot: temp_map,
      createdDate: "11/19/2019",
      upVotes: 10,
      numberOfComments: 30,
    },
    {
      title: "Enchanted Forest",
      description: "Get lost in the magic of an enchanted forest with this mystical map",
      author: "NatureLover",
      tags: ["forest", "nature", "enchanted"],
      mapSnapshot: temp_map,
      createdDate: "04/27/2016",
      upVotes: 10,
      numberOfComments: 30,
    },
    // ... add more map information objects as needed
  ])

  const [currentPage, setCurrentPage] = useState(1);
  const [mapsPerPage] = useState(6); // Adjust the number of maps per page as needed
  const [sortOption, setSortOption] = useState('title');
  const [categoryFilter, setCategoryFilter] = useState('None');

  const handleCreateMap = () => {
    console.log("create map");
    navigate("/create");
  }
  const handleSortChange = (option) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  // Apply sort
  const sortedMapList = [...mapList].sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "Hight Upvotes") {
      return b.upVotes - a.upVotes;
    } else if (sortOption === "Popular") {
      return b.numberOfComments - a.numberOfComments;
    }
    // Add more sorting options as needed
    return 0;
  });

  // Apply category filter
  const filteredMapList = (categoryFilter === 'None' || categoryFilter === '' || categoryFilter === null)
  ? sortedMapList
  : sortedMapList.filter((map) => map.tags.includes(categoryFilter));

  const indexOfLastMap = currentPage * mapsPerPage;
  const indexOfFirstMap = indexOfLastMap - mapsPerPage;
  const currentMapList = filteredMapList.slice(indexOfFirstMap, indexOfLastMap);

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
              <em>Select</em>
            </MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="Hight Upvotes">Hight Upvotes</MenuItem>
            <MenuItem value="Popular">Popular</MenuItem>
          </Select>
        </FormControl>

        {/* Category */}
        <Autocomplete
          value={categoryFilter}
          onChange={(e, value) => handleCategoryFilter(value)}
          options={[...new Set(['None', ...mapList.flatMap((map) => map.tags)])]}
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