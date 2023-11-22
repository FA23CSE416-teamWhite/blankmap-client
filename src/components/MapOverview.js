import React from "react";
import Tags from "./Tags";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const MapOverview = ({ mapInfo }) => {
  const { title, description, author, tags, mapSnapshot, createdDate } = mapInfo;
  let tag_buttons = tags.map((tag, index) => (
    <IconButton
      key={index}
      sx={{
        fontSize: '10px',
        backgroundColor: '#0844A4',
        color: 'white',
        padding: '5px',
        borderRadius: '10px',
        margin: '0 4px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s', // Add transition for smooth color change
        ':hover': {
          backgroundColor: '#0A5CE8', // Change color on hover
        },
      }}
    >
      {tag}
    </IconButton>
  ));

  return (
    <Card style={{ marginBottom: '25px', backgroundColor: '#EBEBEB', marginTop: '15px', borderRadius: '10px' }}>  <CardContent style={{ padding: '0px' }}>
      <Link to={`/detail`} style={{ textDecoration: "none" }}>
        <ListItem
          sx={{ borderRadius: "10px", p: "10px", display: 'flex', p: 1 }}
          style={{ transform: "translate(1%,0%)", width: '98%', fontSize: '32pt' }}
          onClick={(event) => {

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
              sm={2}
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
            <Grid item xs={12} sm={9}>
              <Box sx={{ p: 1, flexGrow: 1 }}>
                <Typography sx={{
                  color: '#0844A4', fontWeight: 'bold', transition: 'color 0.3s', // Add transition for smooth color change
                  ':hover': {
                    color: '#0A5CE8', // Change color on hover
                  },
                }} varient='h3'>{title}</Typography>
                <Typography sx={{ color: 'black', fontSize: "12px" }}>Desciption: {description}</Typography>
                {tag_buttons}
              </Box>
              <Typography sx={{ fontSize: "12px", textAlign: 'right', color: '#0844A4' }}>
                By {author} on {createdDate}
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
      </Link>
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