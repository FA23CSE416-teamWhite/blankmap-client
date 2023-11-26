import React from "react";
import ProfileMenu from "./ProfileMenu";

import  avatar from "./images/avatar.png";
import { Paper, Typography, Box, Button, Grid } from "@mui/material";
import AuthContext from "../auth";
import { useContext } from "react";

const MyInfoScreen = () => {
  const { auth } = useContext(AuthContext);
  
  
  if(!auth.user){
    console.log("GETT LOGGG IN")
    auth.getLoggedIn();
    return <div>Loading...</div>;
  }
  const info=auth.user;
  const dateObject = new Date(auth.user.dateJoined);
  const formattedDate = dateObject.toLocaleDateString();
    const avatarUrl = avatar;
    const handleGetLoggin = () => {
      auth.getLoggedIn();
    }
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
            <strong>Username:</strong> {info.userName}
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
            <strong>Member Since:</strong> {formattedDate}
          </div>
          <div>
            <strong>Number of Maps:</strong> {info.mapLength}
          </div>
          <div>
            <strong>Bio:</strong> {info.bio}
          </div>
        </div>
        <Button variant="contained" onClick={() => handleGetLoggin()} style={{ marginTop: '20px' }}>Edit</Button>
      </Paper>
      </Grid>
    </Box>
  );
};

export default MyInfoScreen;