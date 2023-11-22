import React from "react";
import ProfileMenu from "./ProfileMenu";
import NavBar from "./NavBar";
import  avatar from "./images/avatar.png";
import { Paper, Typography, Box, Button, Grid } from "@mui/material";

const MyInfoScreen = ({userInfo}) => {
  var info=userInfo
  info={
    username: "testuser",
    email : "email@email.email",
    phone : "123-456-7890",
    memberSince : "1/1/2014",
    numberOfMaps : "2",
    bio : "Nice to meet you!"

  }
    
    const avatarUrl = avatar;

 return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      <Grid item xs={12} sm={3}>
        <ProfileMenu />
      </Grid>
      <Grid item xs={12} sm={9} sx={{ width: '100%', flex: 'auto' }}>
        <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          marginLeft: '25px',
        }}
      >
        <div className="avatar-section">
          <img src={avatarUrl} alt="User Avatar" className="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        </div>

        <div className="user-info" style={{ marginTop: '20px' }}>
          <Typography variant="h5">User Information</Typography>
          <div>
            <strong>Username:</strong> {info.username}
          </div>
          <div>
            <strong>Email:</strong> {info.email}
          </div>
          <div>
            <strong>Phone:</strong> {info.phone}
          </div>
          <div>
            <strong>Password:</strong> ********* {/* Display password securely or provide an option to reset */}
            {/* Ideally, avoid displaying passwords for security reasons */}
          </div>
          <div>
            <strong>Member Since:</strong> {info.memberSince}
          </div>
          <div>
            <strong>Number of Maps:</strong> {info.numberOfMaps}
          </div>
          <div>
            <strong>Bio:</strong> {info.bio}
          </div>
        </div>
        <Button variant="contained" onClick={() => console.log('Edit button clicked')} style={{ marginTop: '20px' }}>Edit</Button>
      </Paper>
      </Grid>
    </Box>
  );
};

export default MyInfoScreen;