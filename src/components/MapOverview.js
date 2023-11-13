import React from "react";
import Tags from "./Tags"; 
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';

const MapOverview = ({ mapInfo }) => {
  const { title, description, author, tags, mapSnapshot, createdDate } = mapInfo;
  let tag_buttons= tags.map((tag, index) => (
    <IconButton sx={{ fontSize: '10px', backgroundColor: 'blue', color: 'white', padding: '5px'}}>{tags[index]}</IconButton>                
)) 

  return (
    <ListItem
      sx={{borderRadius:"25px", p: "10px", bgcolor: '#8000F00F', marginTop: '15px', display: 'flex', p: 1 }}
      style={{transform:"translate(1%,0%)", width: '98%', fontSize: '32pt' }}
      onClick={(event) => {
          // handle go to map details
      }}
    >
      <Grid container>
        <Grid sx={{
          p: 1,
          flexGrow: 1,
          }} item xs={12} sm={3}>
          <img style={{borderRadius: '10px', border: '2px solid #ccc',}} src={mapSnapshot} alt="map_preview" width='150px'/>
          </Grid>
        <Grid item xs={12} sm={9}>
          <Box sx={{ p: 1, flexGrow: 1 }}>
            <Typography sx={{ color: 'blue' }}varient='h3'>{title}</Typography>
            <Typography sx={{fontSize:"12px"}}>Desciption: {description}</Typography>
            {tag_buttons}
          </Box>
          <Typography sx={{ fontSize:"12px", textAlign: 'right', color: 'blue'}}>
            By {author} on {createdDate}
          </Typography>
          </Grid>
      </Grid>
    </ListItem>
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