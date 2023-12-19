import React, { useContext, useState, useEffect } from "react";
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
// import temp_map from './images/temp_map.png';
import mapApi from "../api/mapApi";
import AuthContext from "../auth";
const HomeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mapList, setMaplist] = useState([])
  const [error, setError] = useState(null)
  const { auth } = useContext(AuthContext)
  useEffect(() => {
    const extractSearchString = () => {
      const search = new URLSearchParams(window.location.search);
      if (search.get("q") === null){
        setSearchQuery("\"\"");
      }else{
        setSearchQuery(search.get("q"));
      }
      // console.log('Search String:', searchQuery);
    };
    extractSearchString();
    const fetchData = async () => {
      try {
        if (searchQuery !== '') {
          const maps = await mapApi.fetchMaps(searchQuery);
          setError(null);
          setMaplist(maps);
        } else {
          setMaplist([]);
          // Alternatively, you can set a default list of maps here
          // setMapList(defaultMapList);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
    return () => {
    };
  }, [location.search, searchQuery, location.pathname]);
  const [currentPage, setCurrentPage] = useState(1);
  const [mapsPerPage] = useState(6); // Adjust the number of maps per page as needed
  const [sortOption, setSortOption] = useState('Newest');
  const [categoryFilter, setCategoryFilter] = useState('None');
  const handleCreateMap = () => {
    auth.getLoggedIn()
    console.log("auth is:", auth.user)
    if (!auth.user){
      console.log("auth is not logged in")
      alert("You must be logged in to create a map!")
      navigate("/login")
    }
    else{
      console.log("create map");
      navigate("/create");
    }
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
      return b.upvotes - a.upvotes;
    } else if (sortOption === "Popular") {
      return b.comments.length - a.comments.length;
    } else if (sortOption === "Newest") {
      // Assuming 'createdAt' is a timestamp or a Date object
      return new Date(b.creationData) - new Date(b.creationData);
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
            {/* <MenuItem value="">
              <em>Select</em>
            </MenuItem> */}
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="Hight Upvotes">Most Upvoted</MenuItem>
            <MenuItem value="Popular">Popular</MenuItem>
            <MenuItem value="Newest">Newest</MenuItem>
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
          style={{ minWidth: '200px', flex: 1 }}
        />
      </div>

      {/* Typography Button on the right */}
      <Button
      variant="contained"
      onClick={handleCreateMap}
      sx={{
        borderRadius: '10px',
        backgroundColor: '#0844A4',
        color: 'white',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: '150px', // Set your desired fixed width
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
        {error && (
          <div style={{ color: 'red', marginBottom: '10px',textAlign: 'center' }}>
            Error: {error.message} {/* Display the error message */}
          </div>
        )}
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