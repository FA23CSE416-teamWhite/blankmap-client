import React, { useContext } from "react";
import Tags from "./Tags";
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { GlobalStoreContext } from '../store/index';

const MapOverview = ({ mapInfo }) => {
  const { globalStore } = useContext(GlobalStoreContext);
  const { title, description, owner, tags, mapSnapshot, creationDate } = mapInfo;
  const navigate = useNavigate();
  const handleSendMapInfo = async (mapData) => {
    try {
      const mappage = await globalStore.setMapPage(mapData.id, mapData.map);
      if (mappage) {
        navigate(`/detail/${mapData.id}`);
      } else {
        console.error("Failed to set map page: Invalid response");
        // Handle error if necessary
      }
    } catch (error) {
      console.error("Error setting map page:", error);
      // Handle error if necessary
    }
  };
  return (
    <Card style={{ marginBottom: '25px', backgroundColor: '#EBEBEB', marginTop: '15px', borderRadius: '10px' }}>  <CardContent style={{ padding: '0px' }}>
      <ListItem
        sx={{ borderRadius: "10px", p: "10px", display: 'flex', p: 1 , cursor: 'pointer'}}
        style={{ transform: "translate(1%,0%)", width: '98%', fontSize: '32pt' }}
        onClick={(event) => {
          console.log("mapinfo:", mapInfo)
          handleSendMapInfo(mapInfo);
        }}
      >
        <Grid container>
          <Grid
            sx={{
              p: 1,
              flexGrow: 1,
            }}
            item
            xs={12}
            sm={1}
            style={{ minWidth: '175px', maxWidth: '175px' }}
          >
            <img
              style={{
                borderRadius: '10px',
                border: '2px solid #0844A4',
                width: '150px',
                height: '110px', // Set the desired height
                objectFit: 'cover', // Crop the image to fit the specified dimensions
              }}
              src={mapSnapshot}
              alt="map_preview"
            />
          </Grid>
          <Grid item xs={12} sm={10}>
            <Box sx={{ p: 1, flexGrow: 1 }}>
              <Typography sx={{
                color: '#0844A4', fontWeight: 'bold', transition: 'color 0.3s', // Add transition for smooth color change
                ':hover': {
                  color: '#0A5CE8', // Change color on hover
                },
              }} varient='h3'>{title}</Typography>
              <Typography sx={{ color: 'black', fontSize: "12px" }}>Desciption: {description}</Typography>
              <Tags tags={tags}></Tags>
            </Box>
            <Typography sx={{ fontSize: "12px", textAlign: 'right', color: '#0844A4' }}>
              By {owner} on {creationDate}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>

    </CardContent>
    </Card>
    // <div className="map-overview">
    //   <img src={mapSnapshot} alt="Map Snapshot" className="map-snapshot" />
    // <div className="map-overview">
    //   <img src={mapSnapshot} alt="Map Snapshot" className="map-snapshot" />

    //   <div className="map-details">
    //     <h2>{title}</h2>
    //     <p>{description}</p>
    //     <p>Created by: {author} {createdDate}</p>

    //     <div className="tags-section">
    //       <strong>Tags:</strong>
    //       <Tags tags={tags} />
    //     </div>
    //   </div>
    // </div>
  );
};

export default MapOverview;