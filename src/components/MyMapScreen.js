import React, { useState } from "react";
import ProfileMenu from "./ProfileMenu";
import MapOverview from "./MapOverview";
import SearchBar from "./SearchBar";
import { Button, Card, CardContent} from "@mui/material";
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import { Box, Grid} from "@mui/material";
import temp_map from './images/temp_map.png';
import NavBar from "./NavBar";
import Typography from '@mui/material/Typography';
import AuthContext from "../auth";
import { useContext,useEffect } from "react";
import GlobalStoreContext from "../store";

const MyMapScreen = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mapFilter, setMapFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const{globalStore} = useContext(GlobalStoreContext)
  const [mapList, setMapList] = useState([]);
  useEffect(() => {
    if (!globalStore.idNamePairs) {
      console.log("loadinguseridname pairs in mymapscreen")
      globalStore.loadUserIdNamePairs();
    } else {
      console.log("idNamePairs already present", globalStore.idNamePairs)
      setMapList(globalStore.idNamePairs);
    }
  }, [globalStore]);
  
  if(!auth.user){
    console.log("GETT LOGGG IN")
    auth.getLoggedIn();
    return <div>Loading...</div>;
  }
  
  let filteredMaps =[]
  if(mapList){
   filteredMaps = mapList.filter((map) => {
    // Apply filtering logic based on mapFilter and searchTerm
    if (mapFilter === "public" && !(map.publicStatus===true)) {
      return false;
    }
    if (mapFilter === "private" && !(map.publicStatus===false)) {
      return false;
    }
    if (searchTerm && !map.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });
  }
  const handleDeleteMap = async (map) => {
    console.log("handleDeleteMap for map:", map)
    globalStore.deleteMapPage(map.id)
  }
  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
    <Grid container>
      <Grid item xs={12} sm={2}>
        <ProfileMenu />
      </Grid>
      <Grid item xs={12} sm={9}>
        <Box sx={{ width: '100%' }}>
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Button
                        onClick={() => {handleDeleteMap(filteredMaps[index])}}
                        sx={{
                          fontSize: '10px',
                          backgroundColor: 'red',
                          color: 'white',
                          padding: '5px',
                          borderRadius: '4px', // Set border-radius for rounded corners
                          margin: '0 4px',
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                      {mapInfo.setting}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </div>
        </Box>
      </Grid>
    </Grid>
  </Box>
  );
};

export default MyMapScreen;