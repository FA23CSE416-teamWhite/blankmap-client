import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid } from '@mui/material';

const MainPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '120vh' }}>
      <div style={{ backgroundColor: 'navy', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3"  gutterBottom style={{ color: 'white' }}>
            Build Your Own Maps
          </Typography>
          <Typography variant="body1"  paragraph style={{ color: 'white' }}>
            Start On A Blank Canvas And Show It To The World
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            style={{
              color: 'black',
              backgroundColor: '#FFFFFF', // Set the background color to white
              height: '80px', // Increase the height as desired
              width: '200px', // Adjust the width as needed
            }}
          >
            Get Started
          </Button>
        </Container>
      </div>
      <div style={{ backgroundColor: '#F5F5F5', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="md">
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6}>
              {/* Content for the second section */}
              <Typography variant="h4" align="center" gutterBottom>
                Draw it Blank!
              </Typography>
              <Typography variant="body1" align="center" paragraph>
                Or Load a Map
              </Typography>
            </Grid>
            
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default MainPage;
